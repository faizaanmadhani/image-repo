import React from 'react'

export default (props: any) => 
  <div className='buttons fadein'>
    <div className='button'>
      <label htmlFor='single'>
          Single Image Upload
      </label>
      <input type='file' id='single' onChange={props.onChange} /> 
    </div>
  </div>