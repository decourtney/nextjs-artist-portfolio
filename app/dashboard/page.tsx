import React from 'react'
import FilePicker from './FilePicker'
import ListOfFiles from './ListOfFiles';

const DashboardPage = () => {
  return (
    <div className="w-full bg-background-100">
      <div className='w-3/4 mx-auto'>
        <ListOfFiles />
        <FilePicker />
      </div>
    </div>
  );
}

export default DashboardPage
