import { useSelector } from 'react-redux';
import ChangePassword from './ChangePassword';
import DifferentAuth from './DifferentAuth';

function Security() {
    const { user } = useSelector(state => state.auth);

    return (
        <div className='change-password-box'>
            {user?.providerId === "email" ? (
                <ChangePassword />
            ) : (
                <DifferentAuth providerId={user?.providerId} />
            )}
        </div>
    );
}

export default Security;
