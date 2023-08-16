var randomSeed = randomSeed || {};

randomSeed.mult = 214013;// 0<乘数<模量
randomSeed.plus = 2031011;// 0<=加数<模量
randomSeed.mod = Math.pow(2, 32);// 模量，>0
// randomSeed.seed = 565455 || Math.floor(choose(0, mod, Math.random));
randomSeed.seed = null;

// LCG https://en.wikipedia.org/wiki/Linear_congruential_generator
randomSeed.generate = ()=>{
    randomSeed.seed = (randomSeed.seed * randomSeed.mult + randomSeed.plus) % randomSeed.mod;
    return randomSeed.seed / randomSeed.mod;
};

randomSeed.choose = (min, max, f = generate)=>{
    let num = Math.floor(f() * (max - min + 1)) + min;
    return num;
}

// function testRand(func) {
//     let d = {};
//     for (let i = 0; i < 100000; i++) {
//         let n = func(1, 10);
//         if (Object.keys(d).includes(String(n))) {
//             d[String(n)] += 1;
//         } else {
//             d[String(n)] = 0;
//         }
//     }
//     console.log(d);
// }

export { randomSeed };