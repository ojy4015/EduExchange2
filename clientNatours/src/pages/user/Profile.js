////////////////////////////////////////////////////////////////

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import UserMenu from '../../components/nav/UserMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Modal } from "antd";
import DaumPostcodeEmbed from 'react-daum-postcode';

export default function UserProfile() {
    // context
    const [auth, setAuth] = useAuth();

    // state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    // hook
    const navigate = useNavigate();
    const location = useLocation();

    //console.log("location => ", location);

    useEffect(() => {
        if (auth?.user) {
            const { name, email, address } = auth.user;
            setName(name);
            setEmail(email);
            setAddress(address);
        }
    }, [auth?.user]);

    // update name and address here
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log('password => ', password);
            // email can not be updated, only name and address are to be updated
            // const { data } = await axios.put("/users/profile", { name, password, address });
            const { data } = await axios.put("/users/profile", { name, address });
            //console.log("profile updated => ", data);
            if (data?.error) {
                toast.error(data.error);
            } else {

                setAuth({ ...auth, user: data });

                // local storgae update
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile updated");
                //console.log(auth.user);
                navigate(location.state || `/dashboard/${data?.user?.role === "admin" ? "admin" : "user/profile"}`);

            }
        }
        catch (err) {
            console.log(err);
        }
    };

    const showModal = () => {
        setIsOpen(true);
    };

    const handleOk = () => {
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleDeleteMeSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log('password => ', password);
            // email can not be updated, only name and address are to be updated
            // const { data } = await axios.put("/users/profile", { name, password, address });
            await axios.delete("/users/deleteMe");
            localStorage.clear();
            navigate(`/login`);
        } catch (err) {
            console.log(err);
        }
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        fullAddress = "우편번호 : " + data.zonecode + "  주소 : " + fullAddress
        setAddress(fullAddress)
        handleOk()
    }

    /////////////////////////////////////////

    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`}
                subTitle="User Dashboard"
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light"> Profile</div>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="form-control m-2 p-2"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus={true}
                            />
                            <input
                                type="email"
                                className="form-control m-2 p-2"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={true}
                            />
                            <textarea
                                className="form-control m-2 p-2"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </form>
                        <div className="d-flex justify-content-between">
                            <Button type="default" onClick={showModal}>주소입력창 열기</Button>
                            {isOpen && (
                                <Modal title="주소록" open={true} onOk={handleOk} onCancel={handleCancel}>
                                    <DaumPostcodeEmbed onComplete={handleComplete} />
                                </Modal>
                            )}
                        </div>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-primary m-2 p-2">정보 수정</button>
                                <button onClick={handleDeleteMeSubmit} className="btn btn-primary mt-3" type="submit" >
                                    회원 탈퇴
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}