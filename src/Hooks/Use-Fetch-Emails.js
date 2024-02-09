import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const UseFetchEmails = (userId, url, actionCreator) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get(url);

                if (response.status === 200) {
                    const data = response.data;

                    if (data) {
                        const emailsArray = Object.entries(data).map(([id, email]) => ({ id, ...email }));
                        dispatch(actionCreator(emailsArray));
                    }
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };

        fetchEmails();

        const intervalId = setInterval(fetchEmails, 2000);
        return () => clearInterval(intervalId);

    }, [dispatch, userId, url, actionCreator]);
};

export default UseFetchEmails;