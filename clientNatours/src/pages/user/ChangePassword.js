import { useState, useEffect } from 'react';
// import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";

export default function ChangePassword() {
    // context
    // const [auth, setAuth] = useAuth();

    // // state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);


    // update password
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.patch(`/users/updateMyPassword`,
                { currentPassword, newPassword, confirmNewPassword }
            );

            // something worong
            if (data?.error) {
                console.log(data.error);
                setLoading(false);
            } else {
                // localStorage.setItem("auth", JSON.stringify(data));
                // setAuth({ ...auth, token: data.token, user: data.user });

                setLoading(false);
                toast.success("password changeing successful");
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error('password changing failed. Try again.');
        }
    };


    return (
        <>
            <Jumbotron title='ChangePassword'
                subTitle="Change Password"
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light"> 비밀번호 수정</div>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="password"
                                className="form-control m-2 p-2"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control m-2 p-2"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control m-2 p-2"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />

                            <button className="btn btn-primary m-2 p-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
} 