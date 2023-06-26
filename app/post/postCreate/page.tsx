// import PostCreate from "./PostCreate";

export default function page({params}:{params : {id: number}}) {
    const {id} = params;
    console.log(id)
    return(
        <div>
            {/*<PostCreate params={id} />*/}
        </div>
    )
}