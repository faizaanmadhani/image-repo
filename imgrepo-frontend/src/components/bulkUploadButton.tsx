import React from 'react'

export default (props: any) => 
  <div className='buttons fadein'>
    <div className='button'>
      <input type='file' id='multi' onChange={props.onChange} multiple />
    </div>
  </div>