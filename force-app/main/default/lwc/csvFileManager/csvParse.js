export function parse(csv){
    const rows= csv.split(/\r\n|\n/);
    const headers=rows[0].split(',');
    const data=[];
    rows.forEach((row,rowNumber)=>{
        if(rowNumber ===0){
            return;
        }
        else{
            const eachColumnOfRow=row.split(',');
            const rowObject={};
            for(let column=0;column<headers.length;++column){
                rowObject[headers[column]]=eachColumnOfRow[column];
            }
            data.push(rowObject);
            
        }
    })
    return data;
}