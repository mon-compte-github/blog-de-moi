## Serendipity
Ca fait bientôt **12 ans jour pour jour** que j'ai mis mon premier blog en ligne. C'était le 13 avril 2005. J'avais galéré plusieurs jours pour brancher l'authentification d'un serveur linux sur l'annuaire ldap d'entreprise et j'ai voulu garder une trace de mes pérégrinations. A l'époque, [Wordpress](https://wordpress.com) n'avait pas encore la renommée ni le monopole qu'il a aujourd'hui. **Il n'y avait pas beaucoup de systèmes de blogs open source pour le bloggueur du dimanche**. Je suis tombé sur [Serendipity](https://docs.s9y.org), ça marchait pas trop mal, il y avait quelques thèmes pas trop vilains et un système de plugins, alors je me suis lancé à écrire mes premiers articles.

Très vite, j'ai été frustré par **des trucs qui marchaient plus ou moins bien ou des fonctionnalités qui manquaient**. J'ai récupéré le source et j'ai contribué au projet en développant [un plugin de sauvegarde automatique](https://blog.s9y.org/archives/117-Autosave-Plugin.html). A l'époque, pas de *pull request*, on s'envoyait des mails avec les versions à diffuser. On corrigeait, on testait comme on pouvait et on relivrait à l'arrache.

## Dotclear

Quelques années plus tard, Serendipity n'évoluait plus trop. Les thèmes disponibles était devenus bof. Les nouvelles fonctionnalités se faisaient attendre. Après un rapide tour d'horizon, Wordpress semblait la meilleure alternative : le système était complet, peut-être même un peu trop pour mes besoins. Je me suis donc tourné vers son concurrent français : [Dotclear](http:/dotclear.org) ! Facile à mettre en oeuvre, suffisant pour mes besoins, une interface d'administration bien foutue ... seul hic, les thèmes (gratuits) peu nombreux et pas forcément sexy.

Première étape, la migration des articles. J'ai développé quelques scripts pour migrer l'essentiel (articles, catégories, tags, ...) et tant pis pour le reste. J'ai trouvé un thème pas trop vilain et j'ai continuer à relater mes péripéties avec mes serveurs linux. Les premiers articles étaient rédigés en xhtml (grave erreur !), les suivants en syntaxe wiki dotclear (erreur moins grave mais erreur quand même).

Mi 2015, **1and1 augmente le prix de son offre d'hébérgement de 33%** :-( Je ferme temporairement mon blog dans l'attente de trouver mieux ... et le temps passe.

## Le « fait maison »

Début 2017, je recommence à bidouiller et j'aimerais en garder une trace. Dotclear est toujours là, il a bien évolué, mais il faut une base de donnée, installer des plugins, ... bref. J'ai envie d'autre chose, de plus basic, de plus artisanal ;-).

Ces dernières années, j'ai pas mal bossé sur [Angular JS](https://angularjs.org). Maintenant que la version 2 est sortie, je m'y replonge en me faisant une petite appli de suivi des dépenses. C'est facile, c'est rapide, c'est bluffant (encore plus que la version 1.x). Ca y est, c'est décidé, je vais **me faire mon propre blog**.

Je me suis mis certaines contraintes :

1. Le blog doit être écolo : **pas de cpu gâché** en fonctionnalités inutiles

1. Il doit être **architecturellement simple**

1. **Le contenu doit être réutilisable** facilement (en cas de migration vers un autre système). J'opte illico pour la syntaxe [markdown](https://daringfireball.net/projects/markdown/), trèèèèès répandue.

1. Il doit rester « **artisanal** » ... mais ça doit quand même être sympa à utiliser.

1. Il ne doit pas me coûter un bras. Pour le moment il est sur un [kimsufi](http://kimsufi.com) mais à terme, je voudrais bien l'héberger sur un Raspberry PI.

Voilà donc quelques mois plus tard le résultat, mes premiers articles en détailleront les coulisses. Et pour mon ancien blog, il est sur un disque de sauvegarde quelque part ... j'importerai les articles les plus intéressants et pas complètement désuets au fur et à mesure. Stay tuned ;-)