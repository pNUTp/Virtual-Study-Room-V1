"use client";
import { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, PhoneOff, Expand } from "lucide-react";
import { db } from "../config/firebase";
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc,  
    setDoc, 
    onSnapshot, 
    deleteDoc, 
    arrayUnion 
} from "firebase/firestore";

export default function VideoCallPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const startCall = async () => {
    if (!selectedUser) return;

    const userRef = doc(db, "users", selectedUser);
    const userDoc = await getDoc(userRef); 

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (!userData.online) {
        setError(`${userData.name} is offline.`);
        return;
      }
    } else {
      setError("User not found.");
      return;
    }

    setIsCalling(true);
    setupWebRTC();
  };

  const setupWebRTC = async () => {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    peerConnection.current = new RTCPeerConnection(configuration);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Cannot access camera/microphone. Check browser permissions.");
      return;
    }

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    const callRef = doc(db, "calls", selectedUser);
    await setDoc(callRef, { offer }, { merge: true });

    onSnapshot(callRef, async (snapshot) => {
      const data = snapshot.data();
      if (data?.answer) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        setDoc(callRef, { iceCandidates: arrayUnion(event.candidate) }, { merge: true });
      }
    };

    onSnapshot(callRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.iceCandidates) {
        data.iceCandidates.forEach((candidate) => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
      }
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const endCall = async () => {
    setIsCalling(false);
    localVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
    remoteVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
    await deleteDoc(doc(db, "calls", selectedUser));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 shadow-lg border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Video className="text-yellow-400" />
          Video Call
        </h2>

        {/* User Selection */}
        {!isCalling && (
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Select a User</label>
            <div className="relative">
              <select
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setError(null);
                }}
              >
                <option value="">Choose...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 text-red-500 flex items-center gap-2 text-sm">
            <AlertCircle />
            {error}
          </div>
        )}

        {/* Start Video Call Button */}
        {!isCalling && (
          <button
            className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-md flex items-center justify-center gap-2"
            onClick={startCall}
            disabled={!selectedUser}
          >
            <Video />
            Start Video Call
          </button>
        )}

        {/* Video Call UI */}
        {isCalling && (
          <div className="mt-6 flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-700 rounded-md overflow-hidden">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-auto rounded-md" />
                <p className="text-center text-sm mt-2">You</p>
              </div>
              <div className="border border-gray-700 rounded-md overflow-hidden">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto rounded-md" />
                <p className="text-center text-sm mt-2">Remote</p>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex gap-4 mt-6">
              <button
                className={`p-3 rounded-full ${isMuted ? "bg-gray-600" : "bg-green-500"} hover:opacity-80`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button className="p-3 bg-red-500 rounded-full hover:opacity-80" onClick={endCall}>
                <PhoneOff size={20} />
              </button>
              <button className="p-3 bg-blue-500 rounded-full hover:opacity-80">
                <Expand size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
