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
                            title: a.innerText,
                            link:a.href,
                            discount:div.querySelector('div.card__price-discount').innerText,
                            price:div.querySelector("div.card-price").innerText
                        }
                        page.push(obj)
                    })
                }catch (e){
                    console.log(e)
                }
                return page;
            },{waitUntil:'a.listing__pagination-nav'})
            await res.push(html)
            console.log(res)
            counter++
        }

    }catch (e){
        console.log(e)
        await browser.close()
    }
})().catch( e => { console.error(e) });
