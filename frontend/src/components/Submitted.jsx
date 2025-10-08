function Submitted( {image} ){
    return(
        <>
            <div>You have completed this challenge</div>
            {image && <img src={image.url}
                 alt="Could not load image"
            />}
        </>
    )
}

export default Submitted;