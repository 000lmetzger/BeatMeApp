function Submitted( {image} ){
    return(
        <>
            <div>You have already completed this challenge</div>
            {image && <img src={image.url}
                 alt="Could not load image"
            />}
        </>
    )
}

export default Submitted;