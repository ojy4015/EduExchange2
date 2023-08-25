import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";

export default function ChangePassword() {
    // context
    const [auth, setAuth] = useAuth();

    // // state
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    // const [address, setAddress] = useState("");

    // // hook
    // const navigate = useNavigate();
    // const location = useLocation();

    // //console.log("location => ", location);

    // useEffect(() => {
    //     if (auth?.user) {
    //         const { name, email, address } = auth.user;
    //         setName(name);
    //         setEmail(email);
    //         setAddress(address);
    //     }
    // }, [auth?.user]);

    // update password
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.patch(`/users/updateMyPassword`,
                { currentPassword, newPassword, confirmNewPassword }
            );

            //console.log('data in changing password= ', data);

            // something worong
            if (data?.error) {
                console.log(data.error);
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth({ ...auth, token: data.token, user: data.user });


                toast.success("password changeing successful");
                //navigate(location.state || `/dashboard/${data?.user?.role === 'admin' ? "admin" : "user"}`);
                //navigate(location.state || "/dashboard");

            }
        } catch (err) {
            console.log(err);
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