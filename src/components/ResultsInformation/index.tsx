const ResultsInformation = ({ itemsNumber, statsNumber } : {itemsNumber: number, statsNumber: number}) => {
    
  return itemsNumber > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-700 font-semibold">
            Mostrando <span className="text-blue-600 font-bold">{itemsNumber}</span> de{' '}
            <span className="text-blue-600 font-bold">{statsNumber || 0}</span> itemsNumber
          </p>
        </div>
      );
};

export default ResultsInformation;