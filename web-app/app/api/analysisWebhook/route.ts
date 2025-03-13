
export async function POST(req : Request){

        const {status, message, result} = await req.json();
        if(status == 'success'){
            console.log(result);
            return new Response(JSON.stringify({message : message, data : result}), {
                status : 200
            })

        }else{
            return new Response(JSON.stringify({message : message}), {
                status : 500
            })
        }


    
}