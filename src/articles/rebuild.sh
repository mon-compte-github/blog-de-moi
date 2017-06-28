#!/bin/bash

# on utilise parfois la syntaxe <() qui est le process substitution
# http://mywiki.wooledge.org/ProcessSubstitution


# TODO supprimer les fichier gz dont la taille est supérieure aux fichiers initiaux
# TODO gérer les mises à jour incrémentielles (est-ce vraiment utile ?)
# TODO gérer la pagination quand on aura trop d'articles

# maintenant ^^
now=$(date +"%s")

##################################################################
# Helpers
##################################################################

# crée un fichier temporaire
fichier_temp() {
    [[ `uname` -eq "Darwin" ]] && mktemp -t blog || mktemp
}

# renvoie la chaîne passée convertie en kebab case
kebab_case() {

    local str="$@"
    local output

    # /!\ la locale s'appelle fr_FR.UTF-8 sous macos et fr_FR.utf8 sous debian
    [[ `uname` -eq "Darwin" ]] && locale="fr_FR.UTF-8" || locale="fr_FR.utf8"

    # convertit en minuscule, compresse les espaces, les remplace par des tirets et supprime les accents
    output=$( echo "${str}" | tr '[:upper:]' '[:lower:]' | tr -s '[:space:]' | sed 's/ /-/g' | \
	LC_CTYPE="$locale" sed -e 'y/āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ/aaaaeeeeiiiioooouuuuüüüü/' )

    echo $output
}

##################################################################
## articles récents (les 10 derniers)
##################################################################

# on ne garde que les articles publiés
./jq --slurp "[ .[] | select(.published | fromdate <= $now) ]" $( ls */*/*/metas.json 2> /dev/null | sort -nr | head -10 ) > recent.json

##################################################################
## par catégories
##################################################################

# création du rép d'accueil (au cas où)
mkdir "categories/" 2> /dev/null

# 1) création du fichier d'index qui donne le nombre d'article par catégorie

# l'argument --slurp crée un tableau avec tous les objets fournis en input
# .[] itère sur tous les éléments du tableau nouvellement créé
# select(.published | fromdate <= $now) écarte les billets du futur
# le [ .. ] englobant le filtre crée un nouveau tableau avec
# les éléments produits par le filtre -> on se retrouve donc avec
# un tableau des articles publiés et uniquement eux
# [ .[].category ] extrait les catégories dans un tableau
# /!\ la catégorie ne doit pas être nulle ...
# group_by regroupe les catégoriées identiques (mais n eles dédoublonne pas)
# le dernier map reconstitue la structure finale (catégorie + nb d'articles) :
# [
#   {
#     "cat": "le blog",
#     "nb": 3
#   },
#   {
#     "cat": "inclassable",
#     "nb": 1
#   }
# ]

./jq --compact-output --slurp "[ .[] | select(.published | fromdate <= $now) ] | [ .[].category ] | group_by(.) | map({"cat" : .[0], "nb" : length})" */*/*/metas.json > categories.json

# 2) agrégation des articles par catégorie

# (re)lecture de la liste des catégories
# précédemment extraites dans un tableau 
# et pour chacune, agrégation de ses articles
while read -r categorie
do

    temp=$(kebab_case "$categorie")

    # filtrage des articles non publiés, agrégation dans un tableau et itération pour trouver les articles de la catégorie courante
    ./jq --compact-output --slurp "[ .[] | select(.published | fromdate <= $now) ] | [ .[] | select(.category == \"$categorie\") ]" */*/*/metas.json > "categories/$temp.json"

done < <( ./jq --raw-output ".[].cat" categories.json )

##################################################################
## par tags
##################################################################

# création du rép d'accueil (au cas où)
mkdir "tags/" 2> /dev/null

# 1) création du fichier d'index qui donne le nombre d'article par tag

./jq --slurp "[ .[] | select(.published | fromdate <= $now) ] | [ .[].tags[] ] | group_by(.) | map({"tag" : .[0], "nb" : length})" */*/*/metas.json > tags.json

# 2) agrégation des articles par tag

while read -r tag
do

    temp=$(kebab_case "$tag")

    ./jq --compact-output --slurp "[ .[] | select(.published | fromdate <= $now) ] | [ .[] | select(.tags | contains([\"$tag\"])) ]" */*/*/metas.json > "tags/$temp.json"

done < <( ./jq --raw-output ".[].tag" tags.json )


##################################################################
## flux rss
##################################################################

temp_file=$(fichier_temp)

# https://validator.w3.org/feed/

# les dates doivent être au format RFC 822
# <pubDate>Wed, 02 Oct 2002 15:00:00 +0200</pubDate>

# début du flux xml
cat <<EOF > $temp_file
<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:webfeeds="http://webfeeds.org/rss/1.0">
<channel>
    <title>Dans Mon Bureau Bleu</title>
    <link>http://dmbb.fr</link>
    <language>fr-fr</language>
    <generator>bash + jq ;-)</generator>
    <atom:link href="http://dmbb.fr/articles/feed.xml" rel="self" type="application/rss+xml" />
    <description>Dans mon bureau bleu, on y gère des projets, on y manage des équipes, on y invente des solutions et on les met en oeuvre, et le vendredi, on y met de la musique.</description>
    <pubDate>$( LC_TIME=en_US TZ=Europe/Paris date +"%a, %d %b %Y %k:%M:%S %z" )</pubDate>
EOF

# le contenu du feed est le même que celui de recent.json
# le fichier étant déjà généré, il va nous servir d'input

./jq --raw-output --from-file feed.jq recent.json >> $temp_file

# fin du flux xml
cat <<EOF >> $temp_file
</channel>
</rss>
EOF

# mise à jour du fichier
# et nettoyache
cat $temp_file > feed.xml
rm -f $temp_file


##################################################################
## compression
##################################################################

# compression de tous les fichiers json et markdown 
# écraser les fichiers existants, et garder les originaux

find . \( -name "*.json" -or -name "*.md" \) -exec gzip -kf {} \;

echo 'OK'

## EOF