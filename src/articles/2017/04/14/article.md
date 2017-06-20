Angular 4 est sorti depuis quelques temps maintenant, apportant [son lot de nouveautés](https://github.com/angular/angular/blob/master/CHANGELOG.md#whats-new). Rien de révolutionnaire cette fois, peu de _breaking changes_, la migration devrait donc se faire en douceur. Pour faciliter la vie des ~~migrants~~ ~~migrateurs~~ des gens qui migrent quoi, les équipes Angular ont d'ailleurs mis en ligne un [assistant de migration interactif](https://angular-update-guide.firebaseapp.com). Confiant, je mets à jour les dépendances npm ...

```bash
npm install @angular/{common,compiler,compiler-cli,core,forms,http,platform-browser,platform-browser-dynamic,platform-server,router,animations}@next --save
```

## Live server

Au niveau code, tout compile comme avant. Je lance le serveur de développement, là encore pas d'erreur. Par contre, ma page principale se charge mais pas son contenu (i.e. la liste des derniers articles publiés, récupérée par une requête xhr). La console me sort une erreur 404 ?!?

Ce qui n'est pas dit dans la doc, et j'ai pourtant bien cherché sur le [github d'angular](https://github.com/angular) et sur stackoverflow, c'est que la gestion des _assets_ a changé. En version 2.4, tous les sous-répertoires dans mon répertoire source étaient accessibles sans rien faire. Depuis la migration, il faut déclarer explicitement ces répertoires pour qu'ils soient reconnus.

Tout se passe dans le `.angular-cli.json` à la racine de votre projet. Notez bien le '.' en début du nom de fichier qui fait qu'il est masqué sous Mac et Linux (je ne sais pas pour Windows, je n'en ai pas :-p). 

La clé `assets` ne contient initialement que `assets`, le répertoire par défaut pour stocker les images, les styles, les scripts ...

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "project": {
    "name": "blog-de-moi"
  },
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": [
        "assets",
        "articles",           <-- ajout
        "pages",              <-- ajout
        "favicon.ico"
      ],
      "index": "index.html",
      "...": "..."
    }
}
```

En rajoutant mes deux répetoires de données (contenant les articles et les pages statiques), tout remarche comme avant \0/ Effet de bord (minime), ils seront publiés dans le répertoire _dist_ lors de la création du livrable.

## Packaging

Le blog est à nouveau opérationnel à 100%, il est temps de le déployer ... et là paf !

```bash
$ ng build --prod
ERROR in /.../posts-list.component.ngfactory.ts (1,1): Property 'posts' is private and only accessible within class 'PostsListComponent'.
ng://.../posts-list.component.html (5,7): Property 'error' is private and only accessible within class 'PostsListComponent'.
ng://.../posts-list.component.html (6,7): Property 'categories' is private and only accessible within class 'PostsListComponent'.

...
```

Autre changement de comportement : les variables membres des composants utilisées dans les templates doivent désormais être `public`. Dans le cas contraire, le _live server_ ne semble pas s'en offusquer mais le compilateur lui est moins permissif. Idem pour les handler d'évènements.

Par contre, bonne nouvelle : le code produit est effectivement beaucoup plus léger. Merci au [FESM](https://scotch.io/tutorials/5-features-to-watch-out-for-in-angular-4#5-fesm) ;-)

| Fichier       | Avant   | Après   |
| ------------- | -------:| -------:|
| vendor.js     | 1.2 Mb  | 578 Kb  |
| polyfills.js  |    ø    | 126 KB  |

Sur le blog, la réduction représente au total près de 40% ! Au passage, on remarquera aussi que les polyfills sont regroupés dans un bundle à part, ce qui permet de gagner éventuellement encore quelques centaines de ko si on connaît (ou restreint) les navigateurs clients.

## Conclusion

Pas de grosse modification pour cette fois, la mise à jour s'est plutôt bien passée. Elle passera peut-être moins bien sur un projet un peu plus conséquent. En attendant, je suis [tranquille pour 1 an](https://github.com/angular/angular/blob/master/docs/RELEASE_SCHEDULE.md) ;-)

