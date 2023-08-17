var reporter = reporter || {};

reporter.tag = "";
reporter.inf = "";
reporter.info = (tag, inf)=>{
    reporter.tag = tag;
    reporter.inf = inf;
}

reporter.report = ()=>{
    let s = document.createElement("script");
    s.src = `http://dev.565455.xyz/report/index.php?tag=${reporter.tag}&inf=${reporter.inf}`;
    s.onload = ()=>s.remove();
    s.onerror = (e)=>{
        s.remove();
        console.log("reporter error:", e, "\n", reporter.tag, reporter.inf);
    };
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(s);
}
export {reporter};