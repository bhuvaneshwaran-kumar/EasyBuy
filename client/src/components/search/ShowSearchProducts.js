import React from 'react'
import './ShowSearchProducts.css'
import {useParams} from 'react-router-dom'

function ShowSearchProducts() {
    const {Searchkeys} = useParams()

    console.log(Searchkeys)
    return (
        <div className="ShowSearchProducts">
            hellow !...
        </div>
    )
}

export default ShowSearchProducts
