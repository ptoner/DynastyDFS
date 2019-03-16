class FileService {

    constructor(
        private ipfs: any
    ) {}

    async writeToAll(data: any, files: string[]) : Promise<void>  {

        const buffer: Buffer = Buffer.from(JSON.stringify(data))

        for (let path of files) {
            // console.log(`Writing file: ${path}`)
            await this.ipfs.files.write( path, buffer, {
                create: true, 
                parents: true, 
                truncate: true
            })
            // console.log(`Complete: ${path}`)
        }
    }

    async deleteAll(files: string[]) {

        for (let path of files) {
            if (this.fileExists(path)) {
                await this.ipfs.files.rm(path)
            }
        }
    }


    async loadFile(filename: string) : Promise<any> {

        let contents: any

        try {
            let fileContents: Buffer  = await this.ipfs.files.read(filename)
            contents = JSON.parse(fileContents.toString())
        } catch(ex) {
            //File not found
            // console.log(`File not found: ${filename}`)
        }

        return contents
    }

    async fileExists(filename: string) : Promise<boolean> {

        let exists: boolean = false

        try {
            const hash = await this.ipfs.files.stat(filename, { hash: true})
            exists = true
        } catch(ex) {
            // console.log(ex)
        }

        return exists
    }

    async listFromDirectory(folderName: string ) : Promise<any[]> {
        
        let results = []

        try {
            let files = await this.ipfs.files.ls(folderName)
            for (let file of files) {

                let filename = `${folderName}/${file.name}`
                try {
                    let result = await this.loadFile(filename)
                    results.push(result)
                } catch (ex) {
                    // console.log(`Error reading file: ${filename}`)
                    // console.log(ex)
                }

            }
        } catch (ex) {
            // console.log(`Error: ${folderName}`)
            // console.log(ex)
        }

        
        return results
    }


}

export { 
    FileService
}