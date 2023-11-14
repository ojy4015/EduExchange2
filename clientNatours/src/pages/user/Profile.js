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
import ProfileUpload from '../../components/forms/ProfileUpload';

export default function UserProfile() {
    // context
    const [auth, setAuth] = useAuth();

    // state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    // hook
    const navigate = useNavigate();
    const location = useLocation();

    //console.log("location => ", location);

    useEffect(() => {
        if (auth.user) {
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setAbout(auth.user?.about);
            setPhoto(auth.user?.photo);
        }
    }, [auth?.user]);

    // update name and address here
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log('password => ', password);
            // email can not be updated, only name and address are to be updated
            // const { data } = await axios.put("/users/profile", { name, password, address });
            const { data } = await axios.put("/users/profile", { name, email, address, phone, about, photo });
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
                        <ProfileUpload
                            photo={photo}
                            setPhoto={setPhoto}
                            uploading={uploading}
                            setUploading={setUploading}
                        />
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
                                value={email}
                                disabled={true}
                            />
                            <input
                                type="text"
                                className="form-control mb-4"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <textarea
                                className="form-control m-2 p-2"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="d-flex justify-content-between">
                                <Button type="default" onClick={showModal}>주소입력창 열기</Button>
                                {isOpen && (
                                    <Modal title="주소록" open={true} onOk={handleOk} onCancel={handleCancel}>
                                        <DaumPostcodeEmbed onComplete={handleComplete} />
                                    </Modal>
                                )}
                            </div>
                            <textarea
                                className="form-control mb-4"
                                placeholder="Write about yourslef"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                maxLength={200}
                            />
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-primary m-2 p-2" disabled={loading}>{loading ? "Processing" : "Update profile"}</button>
                                <button onClick={handleDeleteMeSubmit} className="btn btn-primary mt-3" type="submit" >
                                    회원 탈퇴
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
                <pre>
                    {JSON.stringify({
                        name, email, address, phone, about, photo
                    })}
                </pre>
            </div >
        </>
    );
}