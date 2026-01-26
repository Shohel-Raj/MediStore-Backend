import app from "./app";

const PORT=process.env.PORT || 5000

function server(){
    app.listen(PORT,()=>{
        console.log(`Server running on port : ${PORT}`)
    })
}


server()