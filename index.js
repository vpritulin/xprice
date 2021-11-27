const fs = require('fs');
const puppeteer = require('puppeteer')

let link = 'https://www.foxtrot.com.ua/ru/shop/mobilnye_telefony_smartfon.html?page';

(async ()=>{
    let flag = true;
    let res = [];
    let counter = 1;

    try {
        let browser = await puppeteer.launch({
            headless:false,
            slowMo:100,
            devtools:true
        })
        let page = await browser.newPage()
        await page.setViewport({
            width:1400,
            height:900
        })
        while (flag){
            await page.goto(`${link}${counter}`)
            await page.waitForSelector('li.listing__pagination-nav')
            console.log(counter)

            let html = await page.evaluate(async ()=>{
                let page = [];
                try {
                    let divs = document.querySelectorAll('div.card')
                    divs.forEach(div=>{
                        let a = div.querySelector('a.card__title')
                        let obj ={
                            title: a !=null
                                ? a.innerText
                                : 'No-Link',
                            link:a.href,
                            price:div.querySelector("div.card-price").innerText != null
                                ? div.querySelector("div.card-price").innerText
                                : 'No-Price'
                        }

                        page.push(obj)
                    })
                }catch (e){
                    console.log(e)
                }
                return page;
            },{waitUntil:'a.listing__pagination-nav'})
            await res.push(html)
            for (let i in res){
                if (res[i].length === 0) flag = false
            }
            counter++
        }
        await browser.close();
        res = res.flat()

        fs.write('foxtrot.json',JSON.stringify({'data':res}),error=>{
            if (err) throw err
            console.log('foxtrot.json saved')
            console.log('foxtrot.json length - ',res.length)
        });
    }catch (e){
        console.log(e)
        await browser.close()
    }
})().catch( e => { console.error(e) });
