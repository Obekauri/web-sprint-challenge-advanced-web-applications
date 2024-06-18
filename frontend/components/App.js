import React, { useState } from 'react'
import axios from 'axios'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    
    localStorage.removeItem('token')
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage("Goodbye!")
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin()
    // using the helper above.
  }

  const login = async (username, password) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    const logIn = async () => {
      try {
        // Launch a request to the proper endpoint
        const response = await axios.post(
          loginUrl,
          {
            username,
            password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
    
        // Check for successful response
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        } else {
          // Handle successful login here (e.g., store token, redirect, etc.)
          setMessage(`Here are your articles, ${username}!`)
          const data = response.data;
          localStorage.setItem('token', data.token);
          redirectToArticles();
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          logout();
        } else {
          console.log('An error occurred:', error);
        }
      } finally {
        // Turn off the spinner
        setSpinnerOn(false);
      }
    };
    
    // Call the logIn function
    logIn();
  }

  const getArticles = () => {
    // Flush the message state, turn on the spinner
    setSpinnerOn(true)
    // Launch an authenticated request to the proper endpoint
    const token = localStorage.getItem('token') 
    //✨ implement conditional logic: if no token exists  
    if(!token) {
      logout()
    }else {
      setSpinnerOn(true)
      const fetchArticle = async () => {
        try {
          const response = await axios.get(
            articlesUrl,
            { headers: { Authorization: token } }
          )
          setArticles(response.data.articles)
        }catch (error) {
          if(error?.response?.status == 401){
            logout()
          }
        } finally {
          setSpinnerOn(false)
        }
      }
      fetchArticle()
      setSpinnerOn(false)
    }
  };


  const postArticle = async (article) => {
    // ✨ implement
    // Launch an authenticated request to the proper endpoint
    setSpinnerOn(true)
    const token = localStorage.getItem('token') 
    //✨ implement conditional logic: if no token exists  
    if(!token) {
      logout()
    }else {
      const fetchArticle = async () => {
        try {
          // Launch a request to the proper endpoint
          const response = await axios.post(
            articlesUrl,
            {
              title: article.title,
              text: article.text,
              topic: article.topic
            },
            {
              headers: {
                Authorization: token,
                'Content-Type': 'application/json'
              }
            }
          );
      
          // Set the server success message
          setMessage(response.data.message);
      
          // Check if the response status is not OK
          if (response.status !== 200) {
            throw new Error('Post network is not good');
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            logout();
          } else {
            console.log('An error occurred:', error);
          }
        } finally {
          // Turn off the spinner
          getArticles();
          setSpinnerOn(false);
        }
      };
      fetchArticle();
      
    }
  }

  const updateArticle = (article_id, article) => {
    // ✨ implement
    setSpinnerOn(true)
    const token = localStorage.getItem('token') 
    //✨ implement conditional logic: if no token exists  
    if(!token) {
      logout()
      spinnerOn(false)
    }else {
        const fetchArticle = async () => {
          try {
          // and launch a request to the proper endpoint.
            const response = await axios.put(
              `${articlesUrl}/${article_id}`,
              {
                title: article.title,
                text: article.text,
                topic: article.topic
              },
              // On success, we should set the token to local storage in a 'token' key,
              { headers: {
                 Authorization: token,
                'Content-Type': 'application/json'
              } }
            )
            getArticles()
            setMessage(response.data.message)
            if(!response.ok){
              throw new Error('Update network is not good')
            }
          }catch (error) {
            if(error?.response?.status == 401){
              logout()
            }
          } finally {
            setSpinnerOn(false)
          }
        }
        fetchArticle()
    }
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
    // Launch an authenticated request to the proper endpoint
    const token = localStorage.getItem('token') 
    //✨ implement conditional logic: if no token exists  
    if(!token) {
      logout()
    }else {
      setSpinnerOn(true)
        const fetchArticle = async () => {
          try {
          // and launch a request to the proper endpoint.
            const response = await axios.delete(
              `${articlesUrl}/${article_id}`,
              // On success, we should set the token to local storage in a 'token' key,
              { headers: {
                 Authorization: token,
                'Content-Type': 'application/json'
              } }
            )
            setMessage(response.data.message)
            if(!response.ok){
              throw new Error('Update network is not good')
            }
          }catch (error) {
            if(error?.response?.status == 401){
              logout()
            }
          } finally {
            setSpinnerOn(false) 
          }
        }
        fetchArticle()
        getArticles()
    }
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              />

              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId} 
                deleteArticle={deleteArticle} 
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
