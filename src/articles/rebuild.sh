#!/bin/bash

# TODO supprimer les fichier gz dont la taille est supérieure aux fichiers initiaux
# TODO gérer les mises à jour incrémentielles (est-ce vraiment utile ?)
# TODO gérer la pagination quand on aura trop d'articles

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

# concatène les chaînes contenus dans un tableau
# en utilisant le premier argument comme séparateur
array_join() {
    local IFS="${1}"
    shift
    echo "$*"
}

# concatène plusieurs fichiers json en un seul
json_concat() {
    # récupération des paramètres
    # - nom du fichier en sortie
    # - liste des fichiers à concaténer
    
    output="${1}"
    files="${2}"

    temp_file=$(fichier_temp)

    # extraction du premier article
    first=${files[0]}
    files=(${files[@]:1})

    # création du fichier
    echo '[' > "$temp_file"
    cat $first >> "$temp_file"
    for f in ${files[@]}; do
	echo ',' >> "$temp_file"
	cat $f >> "$temp_file"
    done

    echo ']' >> "$temp_file"

    # création du fichier final, en normalisant les espaces
    # et en supprimant les retours chariots (inutiles)
    cat "$temp_file" | tr -d '\n' | sed -e 's/  */ /g' > $output

    rm "$temp_file"
}

##################################################################
## articles récents (les 10 derniers)
##################################################################

counter=0
files=()

# récupération de la liste des fichiers de description
# d'article, triés par ordre chrono inverse
for f in $(ls */*/*/metas.json 2> /dev/null | sort -nr); do
	# on ne garde que 10 entrées
	[[ "$counter" -ge 10 ]] && return 1
	counter=$((counter+1))
 	files+=("$f")
done

if [ ${#files[@]} -eq 0 ]; then
    echo "No articles found :'("
    exit 1
fi

json_concat "recent.json" "${files[@]}"

##################################################################
## par catégories
##################################################################


# 1) d'abord créer le fichier d'index [{ catégorie : nombre },{...}]

# on utilise la syntaxe <() qui est le process substitution
# http://mywiki.wooledge.org/ProcessSubstitution

lines=()
categories=()

while read -r count word
do
    categories+=("$word")
    lines+=("{\"${word}\":$count}")
done < <( cat */*/*/metas.json | ./jq --raw-output '.category // "sans catégorie"' | sort | uniq -c )

result=$(array_join "," "${lines[@]}")

/bin/echo -n "[$result]" > categories.json

# 2) classement des articles dans les catégories

# création du rép d'accueil (au cas où)
mkdir "categories/" 2> /dev/null

# pour chaque catégorie
for categorie in "${categories[@]}"; do

    files=()
    # pour chaque fichier d'index
    for f in $(ls */*/*/metas.json 2> /dev/null | sort -nr); do

	# TODO effecter la comparaion directement via jq avec select(.categorie='')

	# extraction de la catégorie	    
	temp=$(./jq --raw-output '.category // "sans catégorie"' $f)

	
	# l'article est-il dans la catégorie actuelle ?
	[ "$temp" == "$categorie" ] && files+=("$f")
	
        # TODO stopper l'itération si on a le compte d'articles	
	
    done

    temp=$(kebab_case "$categorie")
    json_concat "categories/$temp.json" "${files[@]}"
    
done

##################################################################
## par tags
##################################################################

# 1) d'abord créer le fichier d'index [{ tag : nombre },{...}]

lines=()
tags=()

while read -r count word
do
    tags+=("$word")
    lines+=("{\"${word}\":$count}")
done < <( cat */*/*/metas.json | ./jq --raw-output '.tags[]' | sort | uniq -c )

result=$(array_join "," "${lines[@]}")

/bin/echo -n "[$result]" > tags.json

# 2) classement des articles dans les tags
  
# création du rép d'accueil (au cas où)
mkdir "tags/" 2> /dev/null

files=()

# pour chaque tag
for tag in "${tags[@]}"; do

    # pour chaque fichier d'index
    for f in $(ls -d */*/*/metas.json 2> /dev/null | sort -nr); do

	# l'article est-il rattaché au tag courant ?

	match=$( ./jq --raw-output --arg tag "$tag" '.tags[] | select(. == $tag)'  "$f" )
	
	# si on a une correspondance, c'est que
	# l'article contient le tag courant
	[ -z "$match" ] || files+=("$f")

        # TODO stopper l'itération si on a le compte d'articles                                                                                
    done

    temp=$(kebab_case "$tag")
    json_concat "tags/$temp.json" "${files[@]}"

done

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