export function verificarDominio(req: any, res: any, next: any){
    res.header('Access-Control-Allow-Origin', "*");
    //res.header('Content-Type', '*');
    res.header('Access-Control-Allow-Headers', "*")
    console.log(res)
    next();
}