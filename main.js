const Nightmare = require('nightmare');		
const getpass = require('getpass');

const username = process.argv[2];
if (!username) {
    console.log('usage: node main.js dat11oha'); 
    return;
}

getpass.getPass({}, (err, password) => {
    Nightmare({ show: true }).goto('http://student.lu.se')
        .click('#portalCASLoginLink')
        .type('#username', username)
        .type('#password', password)
        .click('.btn-submit')
        .wait(2000)
        .click('#portalPageFooterNav > div:nth-child(2) > div:nth-child(4) > ul > li:nth-child(1) > a')
        .wait(2000)
        .evaluate(() => {
            const nodeList = document.querySelectorAll('.parentBody');

            return Array.from(nodeList).map(element => element.innerText);
        })
        .then((rows) => {
            console.log('\nFinished courses: ');
            let maxScore = 0;
            let curScore = 0;
            rows.forEach(row => {
                const columns = row.split('\t');
                const code    = columns[0];
                const name    = columns[2];
                const credits = columns[3];
                const grade   = columns[5];
                if (['3', '4', '5'].includes(grade)) {
                    console.log(grade, '\t', credits + 'hp', code, name);
                    maxScore += parseFloat(credits);
                    curScore += credits * grade;
                }
            });
            console.log('\nDone, average:', curScore/maxScore);
        })
        .catch((error) => console.log(error));
});