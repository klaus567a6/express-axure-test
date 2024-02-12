
const path = require('path');
const fs = require('fs');
const htmlParser = require("node-html-parser");
const https = require("https");

const brokenLinkMap = {};
const activeLinkMap = {};

function cleanBrokenLinks(contentEl, filePath) {
    // Bing chat magic... also this website explains it a bit https://regexr.com/
    //const brokenLinksPattern = /(\s*http:[^"]+)"\s*title\s*=\s*"([^"]+)"*>/g;
    //const brokenLinksPattern = /(\w+)\s*=\s*"([^"]+)"\s*title\s*=\s*"([^"]+)"*>/g;
    const brokenLinksPattern = /(\w+)\s*=\s*"([^"]+)"\s*title\s*=\s*"([^"]+)"*>|([^"]+)"\s*title\s*=\s*"([^"]+)"*>/g;
    // /(\w+)\s*=\s*"([^"]+)"\s*title\s*=\s*"([^"]+)"*>/g
    // for -> venting ="http://thehandyforce.com/interior/bathroom-renovations/" title ="Toronto Bathroom renovation inspiration">

    // ([^"]+)"\s*title\s*=\s*"([^"]+)"*>/g
    // for -> http://thehandyforce.com/interior/bathroom-renovations/" title ="Toronto Bathroom renovation inspiration">

    const brokenLinkFound = brokenLinksPattern.test(contentEl.innerText);

    const brokenLinks = contentEl.innerText.matchAll(brokenLinksPattern);

    [...brokenLinks].forEach(link => {
        if(!brokenLinkMap[link[0]]) {
            brokenLinkMap[link[0]] = 1;
        }
        else {
            brokenLinkMap[link[0]] += 1;
        }
    });

    if(!brokenLinkFound) return;

    const content = contentEl.innerHTML;
    // Replace matches with an empty string
    const cleanedHTML = content.replaceAll(brokenLinksPattern, "");

    fs.writeFileSync(filePath, cleanedHTML);
}
function cleanActiveLinks(contentEl, filePath) {
    // Define the regex pattern
    const links = contentEl.querySelectorAll("a");

    links.forEach(link => {
        const linkHTML = link.outerHTML;
        const linkInnerText = link.innerText;
        const linkURL = link.getAttribute("href");
        if(linkURL?.length > 0 && !linkURL?.includes("http://")) return;

        if(!activeLinkMap["u-" + linkHTML]) {
            activeLinkMap["u-" + linkHTML] = 1;
        }
        else {
            activeLinkMap["u-" + linkHTML] += 1;
        }

        contentEl.innerHTML = contentEl.innerHTML.replaceAll(linkHTML, linkInnerText);
    });

    fs.writeFileSync(filePath, contentEl.innerHTML);
}

/**
 * cleans broken links like
 * openings="http://thehandyforce.com/windows/" title="Window installer in Toronto">
 * venting="http://thehandyforce.com/interior/bathroom-renovations/" title="Toronto Bathroom renovation inspiration">
 */
exports.cleanAllContent = (req, res) => {
    console.log("CLEANUP");
    let allowCleanup = true;
    if(!allowCleanup) return;
    const pageCount = 2267;
    for (let i = 1; i <= pageCount; i++) {
        //if(i !== 1020) continue;
        const filePath = `views/content/${i}.html`;

        fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
            if (err) {
                // console.error(err);
                return;
            }

            const contentEl = htmlParser.parse(data);

            try {
                cleanActiveLinks(contentEl, filePath);
                cleanBrokenLinks(contentEl, filePath);
            }
            catch (e) {
                console.error(e);
                res.send(e);
            }


            if(i === pageCount) {
                const cleanupReport = {brokenLinkMap, activeLinkMap};
                console.log("CLEANUP REPORT\n", cleanupReport);
                res.send(JSON.stringify(cleanupReport));
            }
        });
    }
}

exports.scrape = () => {
    let allowScrape = false;
    if (!allowScrape) return;
    for (let i = 1000; i < 2269; i++) {
        const fileName = `${i}.html`;
        const url = "https://www.buildingcode.online/" + fileName;

        https.get(url, res => {
            let data = [];
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log(headerDate)

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                const contentHtml = htmlParser
                    .parse(Buffer.concat(data).toString())
                    .querySelector(".content").outerHTML;

                fs.writeFileSync(`views/content/${fileName}`, contentHtml);

                console.log('Response ended: ', contentHtml);
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }


    res.type("html").send("<div>SCRAPING BRO</div>");
}