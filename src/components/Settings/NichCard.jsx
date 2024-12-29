const NichCard = ({ ImgUrl, Title, Description, handleNich, existingNich }) => {
  return (
    <div className="bg-[#1F1F1F] w-[250px] flex flex-col gap-4 text-center text-white items-center justify-center p-4 rounded-xl">
      <img alt="nich" src={ImgUrl} className="w-24" />
      <h6 className="font-bold">{Title}</h6>
      <p className="text-sm text-gray-300 line-clamp-2">{Description}</p>
      <button
        onClick={() => handleNich(Title)}
        disabled={existingNich === Title}
        className={`bg-[#0004FF]  p-2 rounded-lg w-[80%] ${existingNich === Title ? 'bg-green-400 cursor-not-allowed' : 'bg-[#0004FF] hover:bg-blue-700'}`}
      >
        {existingNich === Title ? 'Selected' : 'Select'}
      </button>
    </div>
  )
}

export default NichCard
