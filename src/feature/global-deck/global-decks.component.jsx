import { useEffect, useState } from 'react';
import { fetchData, showToastError, showToastMessage, customFormatDistanceToNow } from '../../global';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import Empty from 'component/Empty';
import globalDeckService from 'service/global-deck.service';
import GlobalDeckDetailComponent from './global-deck-detail.component';

export default function GlobalDecksComponent() {

  const [globalDecks, setGlobalDecks] = useState();

  const [searchTerm, setSearchTerm] = useState();

  const appElement = document.getElementById('root');
  Modal.setAppElement(appElement);

  async function getGlobalDecks() {
    const rawData = await globalDeckService.getGlobalDecks();
    setGlobalDecks(rawData);
    console.log(rawData);

  }

  async function handleCloneDeck() {
    try {
      const subUrl = `/decks/${detailDeck.id}/clone`;
      const { message } = await fetchData(subUrl, 'POST');
      showToastMessage(message);
    } catch (error) {
      showToastError(error.message);
    }
  }

  useEffect(() => {
    getGlobalDecks();
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      getGlobalDecks();
    } else if (globalDecks && Array.isArray(globalDecks)) {
      const searchDecks = globalDecks.filter(globalDeck =>
        globalDeck.name?.toLowerCase().includes(searchTerm?.toLowerCase())
      );
      setGlobalDecks(searchDecks);
    }
  }, [searchTerm]);


  const stylesModal = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000
    },

    content: {
      width: '800px',
      height: '440px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '6px',
      outline: 'none',
      backgroundColor: 'white'
    },
  }

  const [isOpenDetailDeck, setIsOpenDetailDeck] = useState();

  const onCloseDetailDeck = () => {
    setIsOpenDetailDeck(false);
  }

  const onOpenDetailDeck = (id) => {
    setIdDeckDetailSelected(id);
    setIsOpenDetailDeck(true);
  }
  const [idDeckDetailSelected, setIdDeckDetailSelected] = useState();

  return (
    globalDecks && (
      <>
        <div className='profile flex gap-x-3 items-center justify-between h-12'>
          <div className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse cursor-pointer">
              <li className="inline-flex items-center">
                <span className="dark:text-white inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Chuyên gia
                </span>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="dark:text-white ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">Bộ thẻ</span>
                </div>
              </li>

            </ol>
          </div>
          <div className='flex gap-x-8 items-center'>
            <div className='max-w-md mx-auto'>
              <div className='relative'>
                <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                  <svg
                    className='w-4 h-4 text-gray-500 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 20'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                    />
                  </svg>
                </div>
                <input
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                  }}
                  type='search'
                  id='globalDecks-search'
                  className='dark:text-white dark:bg-gray-700 dark:border-none dark:outline-none block w-full  px-4 h-10 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Name, description...'
                />
              </div>
            </div>
          </div>
        </div>

        <hr className='my-8 dark:opacity-10'></hr>

        {globalDecks.length != 0 ? (
          <div className='mb-12 grid grid-cols-2 gap-12'>
            {globalDecks.map((deck, index) => (
              <div index={index} className=''>
                <span className='text-sm text-gray-800 dark:text-white'>{customFormatDistanceToNow(deck.createdDate)}</span>
                <div className="shadow mt-3 flex justify-between gap-x-6 py-5 border dark:border-none p-4 rounded-lg bg-white  dark:bg-[#2E3856]">
                  <div className="flex min-w-0 gap-x-4">
                    <img className="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900 dark:text-white uppercase truncate">
                        {deck.name}
                      </p>


                      <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-white" 
                      >
                        {deck.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-x-3 items-center font-medium">

                    <div className='flex gap-x-2 items-center'>

                      <div className="mt-1 flex gap-x-2 items-center">
                        {deck.quantityClones}
                        {/* <img src="/src/assets/image/download.png" className='w-3 h-3' alt="" /> */}
                        <i class="fa-solid fa-download"></i>
                      </div>

                      <div className="mt-1 flex gap-x-2 items-center">
                        {deck.quantityCards}
                        {/* <img src="/src/assets/image/money.png" className='w-4 h-4' alt="" /> */}
                        <i class="fa-regular fa-id-card"></i>
                      </div>

                    </div>


                    <button onClick={() => onOpenDetailDeck(deck.id)} type='button' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
                      Detail
                    </button>

                    {/* <button onClick={() => onOpenDetailDeck(deck.id)}
                      className="relative px-5 py-1 overflow-hidden font-medium text-indigo-600 bg-indigo-50 border border-gray-100 rounded-lg shadow-inner group">
                      <span
                        className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-indigo-600 group-hover:w-full ease"></span>
                      <span
                        className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-indigo-600 group-hover:w-full ease"></span>
                      <span
                        className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-100 bg-indigo-600 group-hover:h-full ease"></span>
                      <span
                        className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-100 bg-indigo-600 group-hover:h-full ease"></span>
                      <span
                        className="absolute inset-0 w-full h-full duration-300 delay-200 bg-indigo-600 opacity-0 group-hover:opacity-100"></span>
                      <span
                        className="relative text-base font-semibold transition-colors duration-300 delay-100 group-hover:text-white ease">
                        Detail</span>
                    </button> */}

                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <Empty />
        )}


        {/* thay thế */}

        <GlobalDeckDetailComponent

          isOpenDetailDeck={isOpenDetailDeck}
          onCloseDetailDeck={onCloseDetailDeck}
          idDeckDetailSelected={idDeckDetailSelected}
        />



        {/* <Modal
          isOpen={isShowDetailDeck}
          onRequestClose={() => setIsShowDetailDeck(false)}
          contentLabel='Custom Modal'
          style={stylesModal}
        >
          {detailDeck?.cards.length != 0 ? (
            <div className=''>
              <div className='flex items-center gap-x-4'>
                <div className='rounded-full h-10 w-10 overflow-hidden cursor-pointer'>
                  <img
                    src={
                      detailDeck?.user.avatar
                        ? detailDeck?.user.avatar
                        : '/user.png'
                    }
                    loading='lazy'
                    className='w-full h-full'
                    alt=''
                  />
                </div>
                <div className='flex flex-col gap-y-2 flex-1'>
                  <div className='flex gap-x-2 items-center'>
                    <span className='font-bold text-xl'>
                      {detailDeck?.name}
                    </span>t
                    <span>({detailDeck?.quantityCards} thẻ)</span>
                  </div>

                  <div className='flex items-center gap-x-3'>


                    <Link
                      to={`/users/${detailDeck?.user.email}`}
                      className='font-light text-sm text-blue-600 underline'
                    >
                      {detailDeck?.user.firstName +
                        ' ' +
                        detailDeck?.user.lastName}
                    </Link>

                    {detailDeck?.user.roles.map((role, index) => {
                      return (
                        <span key={index}>
                          <span className='text-xs bg-gray-300 p-1 rounded-lg'>
                            {role}
                          </span>
                        </span>
                      )
                    })}
                  </div>
                  <div className='mt-2 text-gray-700 text-sm text-ellipsis overflow-hidden whitespace-nowrap'>
                    {detailDeck?.description}
                  </div>
                </div>

                <div className='flex gap-x-2 items-center'>
                  <span className='text-sm'>
                    {detailDeck?.quantityClones} clone
                  </span>
                  <button
                    onClick={handleCloneDeck}
                    className='flex items-center gap-x-2 h-8 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 text-center'
                  >
                    <span>Clone</span>

                    <i className='fa-solid fa-download'></i>
                  </button>
                </div>
              </div>

              <hr className='my-4' />

              <table className='w-full text-sm text-left rtl:text-right text-gray-500 h-[100px] overflow-y-scroll'>
                <thead className='text-sm text-gray-700 uppercase'>
                  <tr>
                    <th scope='col' className='px-6 py-5'>
                      Term
                    </th>
                    <th scope='col' className='px-6 py-5'>
                      definition
                    </th>
                    <th scope='col' className='px-6 py-5'>
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailDeck?.cards.map((card, index) => (
                    <tr key={index} className='odd:bg-gray-100 even:bg-white'>
                      <td className='px-6 py-5 font-medium'>{card.term}</td>
                      <td className='px-6 py-5'>{card.definition}</td>
                      <td className='px-6 py-5'>
                        {card.example ? card.example : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </Modal> */}




        <ToastContainer />
      </>
    )
  )
}
