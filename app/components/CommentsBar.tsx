export default function CommentsBar (props) {
    const pay = props.parameterValue
    return (
        <div className="w-48 h-screen bg-gray-400 flex transition duration-50" style={{transform:`translateX(100%)`}}>
            hello bar
            {pay}
        </div>
    )
}