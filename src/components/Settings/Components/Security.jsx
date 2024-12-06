import React, { useState } from 'react'
import ChangePassword from './ChangePassword'

function Security() {

    const [isEditingPassword, setIsEditingPassword] = useState(false);


    return (
        <div className='change-password-box'>
                <ChangePassword/>
        </div>
    )
}

export default Security