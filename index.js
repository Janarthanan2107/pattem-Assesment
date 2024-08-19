const dancingSentence = (str) => {
    let result = '';
    let wordIndex = 0;

    for (let i = 0; i < str.length; i++) {
        const element = str[i];
        if (element === ' ') {
            result += element;
        } else if (wordIndex % 2 === 0) {
            wordIndex++;
            result += element.toUpperCase();
        } else {
            result += element.toLowerCase();
            wordIndex++;
        }
    }

    return result;
}




const sentence1 = dancingSentence("This is a           dancing sentence")
const sentence2 = dancingSentence("aaaaaaaaaaaaaaa")
const sentence3 = dancingSentence("a b cd efg")
const sentence4 = dancingSentence("z")



console.log(sentence1);
console.log(sentence2);
console.log(sentence3);
console.log(sentence4);
