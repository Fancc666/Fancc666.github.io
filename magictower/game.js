/**
 * author: FANCC
 * 2023.8.14
 * magic tower engine
 */
import { randomSeed } from "./randomSeed.js";
import { Matrix } from "./matrix.js";
import { reporter } from "./reporter.js";

const NORMAL = 0;
const WX = 1;
const SEED = 2;
const TOOL = 3;

var game = game || {};
game.item = null;
game.gameMode = NORMAL;
game.gameSeed = 0;
game.colorBars = [];
game.gameID = 1;
game.end = false;
game.debugMode = false;
game.reporter_switch = true;
game.get_item = (id)=>{
    // game.item = document.getElementById(id);
    game.item = document.querySelector(id);
    return game.item;
}
game.get_items = (id)=>{
    // game.item = document.getElementById(id);
    // game.item = document.querySelectorAll(id);
    return document.querySelectorAll(id);
}
game.hide_page = (id)=>{
    game.get_item(id);
    game.item.classList.remove("active");
}
game.show_page = (id)=>{
    game.get_item(id);
    game.item.classList.add("active");
}
game.rule = null
game.click_bar = (index)=>{
    // game.item = element;
    // console.log(element, game.colorBars);
    for (let i=0;i<game.rule[index].length;i++){
        if (game.rule[index][i]){
            game.change_color(i);
        }
    }
}
game.change_color = (index)=>{
    let nowColor = Number(game.colorBars[index].attributes.color.value);
    let newColor = (nowColor + 1) % 4;
    game.colorBars[index].attributes.color.value = String(newColor);
    game.colorBars[index].classList.remove(`color${nowColor}`);
    game.colorBars[index].classList.add(`color${newColor}`);
}
game.initColor = ()=>{
    if (game.gameMode === NORMAL){
        for (let i=0;i<game.colorBars.length;i++){
            for (let j=0;j<4;j++){
                game.colorBars[i].classList.remove(`color${j}`);
            }
        }
        for (let i=0;i<game.colorBars.length;i++){
            game.colorBars[i].classList.add(`color${game.data[game.gameID].initColor[i]}`);
            game.colorBars[i].attributes.color.value = String(game.data[game.gameID].initColor[i]);
        }
    }
    if (game.gameMode === WX || game.gameMode === SEED){
        for (let i=0;i<game.colorBars.length;i++){
            for (let j=0;j<4;j++){
                game.colorBars[i].classList.remove(`color${j}`);
            }
        }
        for (let i=0;i<game.colorBars.length;i++){
            game.colorBars[i].classList.add(`color${game.data['WX'].initColor[i]}`);
            game.colorBars[i].attributes.color.value = String(game.data['WX'].initColor[i]);
        }
    }
}
game.init_all = ()=>{
    game.get_item("#gameTitle").innerText = `第${game.gameID}关`;
    game.get_item("#gameSeed").style.display = "none";
    // game.get_item("#gameID").innerText = String(game.gameID);
    game.initColor();
    game.get_item("#tip").innerText = game.data[game.gameID].tip;
    game.rule = game.data[game.gameID].rule;
}
game.init_all_wx = ()=>{
    game.get_item("#gameTitle").innerText = "无限模式";
    game.get_item("#gameSeed").style.display = "block";
    game.gameSeed = randomSeed.choose(100000, 999999, Math.random);
    game.get_item("#gameSeedNum").innerText = String(game.gameSeed);
    game.generate_wx_game();
    game.initColor();
    game.rule = game.data['WX'].rule;
    game.get_item("#tip").innerText = game.data['WX'].tip;
}
game.init_all_seed = ()=>{
    game.get_item("#gameTitle").innerText = "种子测试";
    game.get_item("#gameSeed").style.display = "block";
    game.get_item("#gameSeedNum").innerText = String(game.gameSeed);
    game.generate_wx_game();
    game.initColor();
    game.rule = game.data['WX'].rule;
    game.get_item("#tip").innerText = game.data['WX'].tip;
}
game.checkNext = ()=>{
    let flag = 0;
    for (let i=0;i<game.colorBars.length;i++){
        if (game.colorBars[i].attributes.color.value === "0"){
            flag += 1;
        }
    }
    if (flag < 4 && !game.debugMode){
        alert("您还未完成谜题");
    }else{
        game.next();
    }
}
game.next = ()=>{
    if (game.gameMode === WX){
        if (!game.debugMode && game.reporter_switch){
            reporter.info("magic-tower", `seed complete ${game.gameSeed}`);
            reporter.report();
        }
        game.init_all_wx();
        return;
    }
    if (game.gameMode === SEED){
        return;
    }
    if (!game.end){
        if (!game.debugMode && game.reporter_switch){
            reporter.info("magic-tower", `level complete ${game.gameID}`);
            reporter.report();
        }
        game.gameID += 1;
        if (game.data[game.gameID] === undefined){
            alert("恭喜通关！没有更多关卡了");
            game.end = true;
        }else{
            game.init_all();
            // 记录进度
            if (localStorage.getItem("game_process") === null || Number(localStorage.getItem("game_process")) < game.gameID){
                localStorage.setItem("game_process", game.gameID);
            }
        }
    }
}

game.to_select_page = ()=>{
    game.hide_page("#welcome");
    game.hide_page("#game");
    game.show_page("#select");
}
game.start_game = ()=>{
    game.hide_page("#welcome");
    game.hide_page("#select");
    game.show_page("#game");
    game.get_items(".colorbar").forEach((e)=>{
        game.colorBars.push(e);
        e.addEventListener("click", ()=>{game.click_bar(e.attributes.floor.value)});
    });
    game.init_all();
}
game.start_game_wx = ()=>{
    game.hide_page("#welcome");
    game.hide_page("#select");
    game.show_page("#game");
    game.get_items(".colorbar").forEach((e)=>{
        game.colorBars.push(e);
        e.addEventListener("click", ()=>{game.click_bar(e.attributes.floor.value)});
    });
    game.gameMode = WX;
    game.init_all_wx();
}
game.start_game_seed = ()=>{
    let user_input = prompt("请输入随机种子");
    let rej = ['', '0', null, 0, NaN];
    if (rej.includes(user_input) || rej.includes(Number(user_input)) || Number(user_input)<100000 || Number(user_input)>999999){
        return;
    }
    game.gameSeed = Number(user_input);
    game.hide_page("#welcome");
    game.hide_page("#select");
    game.show_page("#game");
    game.get_items(".colorbar").forEach((e)=>{
        game.colorBars.push(e);
        e.addEventListener("click", ()=>{game.click_bar(e.attributes.floor.value)});
    });
    game.gameMode = SEED;
    game.get_item("#next").style.display = "none";
    game.init_all_seed();
}
game.start_game_help = ()=>{
    game.hide_page("#welcome");
    game.hide_page("#select");
    game.hide_page("#game");
    game.show_page("#help");
    game.gameMode = TOOL;
}
game.helper = ()=>{
    let user_input = prompt("请输入随机种子");
    let rej = ['', '0', null, 0, NaN];
    if (rej.includes(user_input) || rej.includes(Number(user_input)) || Number(user_input)<100000 || Number(user_input)>999999){
        return;
    }
    game.gameSeed = Number(user_input);
    game.generate_wx_game();
    let res = game.solver(game.data['WX'].initColor, game.data['WX'].rule);
    game.get_item("#solve_output").innerText = `
    第1层点${res[0]}下
    第2层点${res[1]}下
    第3层点${res[2]}下
    第4层点${res[3]}下
    `;
}

game.generate_wx_game = ()=>{
    let size = 4;
    randomSeed.seed = game.gameSeed;
    // console.log(randomSeed.generate());
    let i_color = [];
    let flag1 = 0;
    while (flag1 === 0){
        flag1 = 0;
        i_color = [];
        for (let i=0;i<size;i++){
            let t = randomSeed.choose(0, 3, randomSeed.generate);
            flag1 += t;
            i_color.push(t);
        }
    }
    
    let i_rule = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    let flag2 = 0;
    while (flag2 !== 1 && flag2 !== -1){
        for (let i=0;i<size;i++){
            for (let j=0;j<size;j++){
                if (i === j){
                    continue;
                }
                i_rule[i][j] = randomSeed.choose(0, 1, randomSeed.generate);
            }
        }
        flag2 = Matrix.det(i_rule);
    }
    game.data['WX'].initColor = i_color;
    game.data['WX'].rule = i_rule;
}
game.all_game_solve = (start_num=100000)=>{
    for (let i=start_num;i<=999999;i++){
        game.gameSeed = i;
        game.generate_wx_game();
        console.log(i, game.solver(game.data['WX'].initColor, game.data['WX'].rule));
    }
}
game.solver = (init_color, init_rule)=>{
    return Matrix.multiply([init_color.map(e=>-1*e)], Matrix.inv(init_rule))[0]
    .map(e=>{
        if (e >= 4){
            return e%4;
        }
        if (e < 0){
            return (e+Math.floor((4-(e))/4)*4)%4;
        }
        return e;
    });
}
game.load_process = ()=>{
    if (localStorage.getItem("game_process") === null){
        alert("未找到进度记录");
    }else{
        game.gameID = Number(localStorage.getItem("game_process"));
        game.start_game();
    }
}

// data
game.data = {
    1: {
        initColor: [0, 1, 2, 3],
        rule: [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ],
        tip: "黄蓝绿红，循环中是魔塔的奥秘，简单的规则不会继续下去……"
    },
    2: {
        initColor: [1, 1, 2, 2],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [1, 0, 0, 1]
        ],
        tip: "规则在变化，也许又不曾改变"
    },
    3: {
        initColor: [1, 2, 3, 2],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [1, 0, 0, 1]
        ],
        tip: ""
    },
    4: {
        initColor: [1, 0, 2, 1],
        rule: [
            [1, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [1, 0, 0, 1]
        ],
        tip: "变幻莫测，层层递进……"
    },
    5: {
        initColor: [2, 2, 3, 1],
        rule: [
            [1, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 1]
        ],
        tip: "如果你会矩阵，问题会迎刃而解……"
    },
    6: {
        initColor: [1, 2, 1, 1],
        rule: [
            [1, 0, 1, 1],
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: "如果你会矩阵，问题会迎刃而解……"
    },
    7: {
        initColor: [3, 3, 3, 3],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 1],
            [0, 1, 1, 0],
            [0, 1, 0, 1]
        ],
        tip: "硬试的话，能否成功呢？"
    },
    8: {
        initColor: [2, 3, 2, 3],
        rule: [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: ""
    },
    9: {
        initColor: [0, 0, 1, 2],
        rule: [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 1, 1]
        ],
        tip: "胜利近在咫尺"
    },
    10: {
        initColor: [2, 3, 1, 2],
        rule: [
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 1]
        ],
        tip: "最后一关！"
    },
    'WX': {
        initColor: null,
        rule: null,
        tip: "90万道题均有解，想不出来可以借助求解器！"
    }
}

// for debug
// if (game.debugMode){
//     let debugLevel = Math.max(...Object.keys(game.data).map(a=>Number(a)));
//     game.gameID = debugLevel;
//     game.start_game();
// }
game.debugger = (e)=>{
    if (game.debugMode){
        return eval("("+e+")");
    }
};

function clearProcess(){
    localStorage.removeItem("game_process");
    window.location.reload();
}

game.get_item("#startGame").addEventListener("click", game.to_select_page);
game.get_items(".fh").forEach((e)=>{e.addEventListener("click", ()=>window.location.reload())});
game.get_item("#x1").addEventListener("click", game.start_game);
game.get_item("#x2").addEventListener("click", game.start_game_wx);
game.get_item("#x3").addEventListener("click", game.start_game_seed);
game.get_item("#x4").addEventListener("click", game.start_game_help);
game.get_item("#load").addEventListener("click", game.load_process);
game.get_item("#next").addEventListener("click", game.checkNext);
game.get_item("#helper").addEventListener("click", game.helper);
game.get_item("#reset").addEventListener("click", clearProcess);

// inject
window.game = game;
window.randomSeed = randomSeed;
window.Matrix = Matrix;