export const requestFileUpload = (multiple:boolean)=>{
    let input:HTMLInputElement
    input = document.getElementById('hidden-file-input') as any
    if(!input){
        input = document.createElement('input')
        input.type="file"
        input.id='hidden-file-input'
        input.style.display='hidden'
        document.body.appendChild(input)
    }
    input.multiple = multiple
    const promise = new Promise((resolve,_)=>{
        input.onchange = e=>{
            const files = (e.target as HTMLInputElement).files
            resolve({
                files:Array.from(files),
                clear:()=>document.body.removeChild(input)
            })
        }
        input.click()
    })
    return promise
}

export const requestDownload = (options:any)=>{
    let input:HTMLAnchorElement = document.getElementById('hidden-anchor') as any
    if(!input){
        input = document.createElement('a')
        input.id = 'hidden-anchor'
        document.body.appendChild(input)
    }
    input.href=options.href
    input.download=options.download
    input.click()
}