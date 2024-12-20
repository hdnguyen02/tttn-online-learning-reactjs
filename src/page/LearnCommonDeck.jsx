



import { useEffect, useState } from 'react'
import { fetchData } from '../global'
import { useParams } from 'react-router-dom'

export default function LearnCommonDeck() {


    const params = useParams()

    const [cards, setCards] = useState()
    const [deck, setDeck] = useState()
    const [index, setIndex] = useState(0)
    // const accessToken = localStorage.getItem('accessToken')


    async function getCommonDeck() {
        const subUrl = `/common-decks/${params.id}`
        try { 
            const response = await fetchData(subUrl, 'GET')
            console.log(response)
            setCards(response.data.cards)
            setDeck(response.data)

        }
        catch(error) { 
            console.log(error.message)
        }
    }

   


    useEffect(() => {
        getCommonDeck()
    }, [])


    function handleNextCard() {
        document.getElementById('card').classList.remove('is-flipped')
        const lenCards = cards.length
        if (index == lenCards - 1) {
            setIndex(0)
        }
        else {
            setIndex(index + 1)
        }
    }


    function handlePreCard() {
        const lenCards = cards.length
        if (index == 0) {
            setIndex(lenCards - 1)
        }
        else {
            setIndex(index - 1)
        }
    }


    function front() {
        return <div className='h-full relative flex flex-col items-center justify-center'>
            {action()}
            {cards[index].image && <div className="h-40 flex justify-center">
                <img className="object-contain" src={cards[index].image} loading="lazy"/>
            </div>}
            <p className="text-2xl text-center">{cards[index].term}</p>
        </div>
    }


    function back() {
        return <div className='h-full relative flex flex-col items-center justify-center'>
            {action()}
            <p className="text-2xl text-center">{cards[index].definition}</p>
            {cards[index].example && <p className="text-xl text-center">{cards[index].example}</p>}
        </div>
    }
   


    function action() {
        return (
            <div className='absolute top-4 right-8 flex items-center gap-x-3'>
                <button
                    onClick={event => {
                        event.stopPropagation()
                        // favouriteCard()
                    }}
                >
                    { 
                        cards[index].isFavourite ? (<i className="fa-regular fa-heart text-xl font-light text-red-500"></i>) 
                        : (<i className="fa-regular fa-heart text-xl font-light"></i>)
                    }
                    
                </button>
                <button><i className="fa-regular fa-star text-xl font-light"></i></button>
            </div>
        )
    }

    function handleFlipCard(event) {
        event.currentTarget.classList.toggle('is-flipped')
    }

    return cards && <div className='mx-4 md:mx-24 mt-28'>
        <div className='flex justify-center'>
            <div className="card-container">
                {
                    deck && (<h3 className='text-xl font-medium'>Bộ thẻ: { deck.name }</h3>)
                } 
                <div className="mt-12 card mx-auto" id="card" onClick={handleFlipCard}>
                    <div className="card-front">
                        {front()}
                    </div>
                    <div className="card-back">
                        {back()}
                    </div>
                </div>
                <div className='flex gap-x-6 justify-center items-center mt-5'>
                    <button onClick={handlePreCard} className="bg-[#F0F6F6] h-12 w-12 rounded-full"><i className="fa-solid fa-chevron-left text-xl"></i></button>
                    <span className='text-xl'>{index + 1}/{cards.length}</span>
                    <button onClick={handleNextCard} className="bg-[#F0F6F6] h-12 w-12 rounded-full"><i className="fa-solid fa-chevron-right text-xl"></i></button>
                </div>
            </div>
        </div>
    )
    </div>
    
    
   
}
