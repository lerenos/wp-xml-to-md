var fs = require('fs')
var convert = require('xml-js');
var nhm = require('node-html-markdown')

//Convert XML to json and writes to the disk
let xml = fs.readFileSync('./wp.xml','utf-8')
var json = convert.xml2json(xml, {compact: true, spaces: 4});
fs.writeFileSync('./output/xml2json.json', json)

//Get what I want (the items array)
let items = JSON.parse(json).rss.channel.item
fs.writeFileSync('./output/item-sample.json', JSON.stringify(items[0])) //Write a sample result (the first item) to the disk

//Makes my custom result json and writes it to the file I want
for (const item of items) {            
    
    let data = {}

    if (names.includes(item['wp:post_name']._cdata)){
        
        let categories = item.category
        
        let cat = []
        try {
            cat = categories.map( el => el._attributes.nicename)
        } catch (error) {        
            cat[0] = categories._attributes.nicename
        }
    
        let slug = item['wp:post_name']._cdata

        let postmeta = [] //item["wp:postmeta"] //[]
        item["wp:postmeta"].map( el => postmeta[el["wp:meta_key"]._cdata]=el["wp:meta_value"]._cdata   )

        // console.log(postmeta)
        // let elementor = JSON.parse(postmeta._elementor_data)
        // console.dir(elementor, {depth: null})

        // data[item['wp:post_name']._cdata] = 
        data = {
            title: item.title._cdata,
            pubDate: item['wp:post_date']._cdata,
            slug: slug,
            description: postmeta._yoast_wpseo_metadesc,
            featuredImageAlt: slug,
            categories: cat,
            testimonial: [{review: postmeta?.quote, author: postmeta?.quote_author, occupation: ""}],
//            html: item["content:encoded"]._cdata,
            md: nhm.NodeHtmlMarkdown.translate(item["content:encoded"]._cdata)
//            meta: postmeta
        }
        
        let path = `./output/${slug}.json`
        
        // console.log(path)
        
        fs.writeFileSync(path, JSON.stringify(data))
        
    }
}