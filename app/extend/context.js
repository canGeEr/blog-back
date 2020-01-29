module.exports = {
    dataTypeChange(data,...args) {
        args.forEach((item, index)=>{
            data[item] = data[item] - 0;
        })
        return data
    }
}