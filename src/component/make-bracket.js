export const makeBracket=(sym,count)=>{
    let r='';
    for(let i=0;i<count;i++){
        r+=' '+sym+' '
    }
    return r;
}