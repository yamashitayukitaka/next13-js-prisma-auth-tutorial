import getCurrentUser from "./actions/getCurrentUser"

const Home = async () => {

  const currentUser = await getCurrentUser()
  return <div className="text-center">{currentUser ? <div>認証中</div> : <div>未認証</div>}</div>
  // getCurrentUser() は、セッションや認証情報をもとに「現在ログインしているユーザーの情報（currentUser）」を取得する非同期関数です。
  // この関数が返す currentUser が 存在すれば「認証済みのユーザー」、存在しなければ 「未認証（ログインしていない）」 ことを意味します。
  // JSX では currentUser の有無に応じて "認証中" または "未認証" を表示しています。
}

export default Home
