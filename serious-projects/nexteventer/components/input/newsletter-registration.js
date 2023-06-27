import { useRef, useContext } from 'react';

import NotificationContext from '../../contexts/notification-context';
import { fetchData, convertToArray } from '../../helpers/fetch-util';
import classes from './newsletter-registration.module.css';

function NewsletterRegistration() {
    const emailRef = useRef();
    const useNotificationContext = useContext(NotificationContext);

    async function registrationHandler(e) {
        e.preventDefault();

        const email = { email: emailRef.current.value };
        const emailRegEx =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (emailRegEx.test(email.email)) {
            useNotificationContext.showNotification({
                title: 'Signing Up...',
                message: 'Registering your email to our newsletter...',
                status: 'pending',
            });

            const usersObj = await fetchData(
                'https://nexteventer.vercel.app/api/newsletter'
            );

            if (usersObj === 500) {
                useNotificationContext.showNotification({
                    title: 'Error signing up!',
                    message:
                        'An error has occurred while checking if the email already exists',
                    status: 'error',
                });
            } else {
                const users = convertToArray(usersObj);

                if (users.find(user => user.email === email.email)) {
                    useNotificationContext.showNotification({
                        title: 'Error signing up!',
                        message: 'Error! The email already exists!',
                        status: 'error',
                    });
                } else {
                    const postStatus = await fetchData(
                        'https://nexteventer.vercel.app/api/newsletter',
                        'POST',
                        email
                    );

                    if (postStatus === 200) {
                        useNotificationContext.showNotification({
                            title: 'Email successfully registered!',
                            message:
                                'Your email has been successfully registered',
                            status: 'success',
                        });
                    } else {
                        useNotificationContext.showNotification({
                            title: 'Error signing up!',
                            message: postStatus.error,
                            status: 'error',
                        });
                    }
                }
            }
        } else {
            useNotificationContext.showNotification({
                title: 'Error while signing up!',
                message:
                    'Error! The data entered is invalid. Please, try again',
                status: 'error',
            });
        }
    }

    return (
        <section className={classes.newsletter}>
            <h2>Sign up to stay updated!</h2>
            <form onSubmit={registrationHandler}>
                <div className={classes.control}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Your email"
                        aria-label="Your email"
                        minLength="6"
                        maxLength="64"
                        ref={emailRef}
                    />
                    <button onSubmit={registrationHandler}>Register</button>
                </div>
            </form>
        </section>
    );
}

export default NewsletterRegistration;
