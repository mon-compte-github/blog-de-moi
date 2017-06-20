# permet de générer un item du feed xml
# à partir d'une description d'article
# https://blog.feedly.com/10-ways-to-optimize-your-feed-for-feedly/

.[] |
"<item>",
	@html "<title>\(.title)</title>",
	@html "<link>http://www.dmbb.fr/published/\(.published[0:10] | split("-") | join("/"))</link>",
	@html "<guid isPermaLink=\"true\">http://www.dmbb.fr/published/\(.published[0:10] | split("-") | join("/"))</guid>",
	      "<description><![CDATA[<img class=\"webfeedsFeaturedVisual\" src=\"http://www.dmbb.fr/articles/\(.published[0:10] | split("-") | join("/"))/\(.image).jpg\" alt=\"post-image\" title=\"Image de l'article\">\(.excerpt)]]></description>",
	@html "<pubDate>\( .published | fromdateiso8601 | strftime("%a, %d %b %Y %k:%M:%S %z") )</pubDate>",
	@html "<category>\( .category // empty )</category>",
"</item>"