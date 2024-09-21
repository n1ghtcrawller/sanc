import React, { useEffect, useState, useContext } from 'react';
import './ProductList.css';
import { Link, useNavigate } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";
import { CartContext } from "../CartProvider/CartContext";

export const products = [
    { id: 1, title: 'Brown hoodie MW', price: 3500, description: 'Плотное оверсайз худи', img: "https://lh3.googleusercontent.com/AfB8ka9M3-hSkpI-sXX9TBM6f61OWSm5a2B483VqscEInl5b52Ozi5z0qmjhyH_4DnWkhTW97HxMpV890bSR3aAoO6hcKXV6_WDEU6iv=s2500-rw", category: "Худи", images: ["https://lh3.googleusercontent.com/AfB8ka9M3-hSkpI-sXX9TBM6f61OWSm5a2B483VqscEInl5b52Ozi5z0qmjhyH_4DnWkhTW97HxMpV890bSR3aAoO6hcKXV6_WDEU6iv=s2500-rw", "https://lh3.googleusercontent.com/RjD87hYIAnLPrSsScC2U_bBN6Fce_ins_kXvS8ObfS33UNI5S_YMNGTxl8HTVG8HTVLhEBTrhbLvBjdz7MZYsBl9oPDMy0o8v1m357FF=w768-rw", "https://lh3.googleusercontent.com/zPD4Ll9CmnVWqw4g-FHrS8B5awlAUG5AXH7Y9OSBR8fLjNxBPbwBd_q8GyOhAREH8E6SiSvDaZ2aMbkEpsqzCLNZtIS7zZIfjCzgky8w8g=w768-rw", "https://lh3.googleusercontent.com/Gkzql5LtbKuIhKbIlZeeZkMnrnZaIqSPzT_EjVpEw6HblRMFR4bMovj_Xwe78R2u6CJHsA5EtMp8QLn7WfkkUmEZDhh_3DkPW4pzzz5EUck=w768-rw", "https://lh3.googleusercontent.com/wLeYdCxz4OmHYje7TjE0zeFXFZw2vYrEd8ywz7oKLoZPgBnVmn6rcORFGlkhUaSEAtlTw-I4wdAxLOBNm4dHfcv_AlqDON86tHTzWCSNzw=w768-rw"] },
    { id: 2, title: 'Gray hoodie MW', price: 3500, description: 'Плотное оверсайз худи', img: "https://lh3.googleusercontent.com/lCzqQZdDuztCAVVAdxXKf0nAssFZAowpwj2xYMuc_XKY1_RBv6U7gImI4sfD4T1r4vZne2o6AkroVY0KHm9MiE91eAOGX4e9nn91uEF9_4o=w768-rw", category: "Худи", images: ["https://lh3.googleusercontent.com/lCzqQZdDuztCAVVAdxXKf0nAssFZAowpwj2xYMuc_XKY1_RBv6U7gImI4sfD4T1r4vZne2o6AkroVY0KHm9MiE91eAOGX4e9nn91uEF9_4o=w768-rw", "https://lh3.googleusercontent.com/g-Z4VCibpmWR50_vlM2lh_Sk-vxvf1O0EoeaxDEXLlHeme9RkC9DEfTLsiuFobcjDeO0w1ncNseqoFr9S5r_JNjnT1-JsKQlq3uKyBTpHJo=w768-rw", "https://lh3.googleusercontent.com/BzNIumDsT11Lei7x5JJKEPjzDn2d1YohuWF2i8LNidXY86mQKWVQn9QnTYxFvQCYA64f_ha42QzX-YUMga-8fLCf-7iHvmbsVyzjz7D7=w768-rw", "https://lh3.googleusercontent.com/SFSUvgfrI4A0Hz68NGUQtZOqxwzqUdT4FTD9swyQ2ppGMRsm6fd25XPGPx18DkSGrQUEHRkA0NrMuCMber24_2y9kl0W1qdrnPkgzhV29lk=w768-rw", "https://lh3.googleusercontent.com/2mYNCPoJy2IsI7yJGf6y0Sn9lFBBepsI2q0_z5Ln_bxrlbHO2aIlp1U44fJ6PJyy7jDvCm5T2ozgemBi7R5gyMesTGZM1-VTcE1y3sd_ygk=w768-rw"] },
    { id: 3, title: 'Dark blue hoodie MW', price: 2500, description: 'Плотное оверсайз худи', img: "https://lh3.googleusercontent.com/0aDKVz8mjVdLQW9UkDqqu0cSjxAXYIhA_VeNkprYX-cCwT26gg_CrsnTGLr4EiwPEZ8ufpz2ZkeVh6RSpwVG8WJow2yJKQVykNj_j_641g=w768-rw", category: "Худи", images: ["https://lh3.googleusercontent.com/0aDKVz8mjVdLQW9UkDqqu0cSjxAXYIhA_VeNkprYX-cCwT26gg_CrsnTGLr4EiwPEZ8ufpz2ZkeVh6RSpwVG8WJow2yJKQVykNj_j_641g=w768-rw", "https://lh3.googleusercontent.com/IYTT3Kvy59B5xmg24UqX38w9n-H1JJ5gSEgtpbsibYNQ67k1qPA6Xx3V9hsMIns5hqmbk_QRKwgkrtsf6EDosUZsYzJpLmQeGQtVsCn4PUM=w768-rw", "https://lh3.googleusercontent.com/V9wrOb3zZ20GM20W_a2UWKUcjvZnnz_BUHWRDwRabkk1mQGQ9NSYp4uJL3DpQhccnVwx4IZg0YUYjxpgZhunNhqrU2Ls2TvbqlPsWujx=w768-rw", "https://lh3.googleusercontent.com/25tqybTaEhXDXa_Xm_6fLcSFrqJAO3OhEeKp9ifiC43F0yQIGKKJOaW3hSB5ciDmWZzEjLy5Y_n6TwhjmeMuKDWx0UL3d3EkXlKz_b0E3Q=w768-rw", "https://lh3.googleusercontent.com/PpcA-PGTAjq8IzGJJlN5_BR6m9QkoER9B2cqYQkr9P51DQucjgXudrWsp4n9kO4SFtZ6HVq8lkzCN0LsfxYre9nJAhHeGTicZoiZxlf3Bw=w768-rw"] },
    { id: 4, title: 'White t-shirt MW', price: 1500, description: 'Плотная оверсайз футболка', img: "https://lh3.googleusercontent.com/epAt_LwITAZal6cJTQW5GOMJatd7Euq0XXr_44prFkQ_7jZNbaHEcfWoLe37G8ycg2k817ZN4d0o7un1PA_7txRaa2dIRO2qWbmXGy0tDgM=w768-rw", category: "Футболки", images: ["https://lh3.googleusercontent.com/epAt_LwITAZal6cJTQW5GOMJatd7Euq0XXr_44prFkQ_7jZNbaHEcfWoLe37G8ycg2k817ZN4d0o7un1PA_7txRaa2dIRO2qWbmXGy0tDgM=w768-rw", "https://lh3.googleusercontent.com/AA_IxlCIcR8qFYEpvQ8e9YRR57wjll_Bstb2OoqqHAeeermZ1qeD8Fq8_rtqd7z8ZzfZCRlgO8YGIjCUfaMqFe_HNtjovsjPpUDvrLOPQg=w768-rw", "https://lh3.googleusercontent.com/J0VHmQum_Y-SxcXmzH6BDDdVPsl1uDTSJ5hI4TBI6a0d6Dfv4k_kxGHoOXZQf2rYF3-Om5FbnMVi3KQag2FBGW5p_p9JrLhsckeK4vDW=w768-rw", "https://lh3.googleusercontent.com/8k_6jlCv6_D7K6OO7FV9K2uR3R_e5mahGm0ht5h2X3Knb7ZoJl_7cfubEEih76IwtqEbOe1iqJ_GQlzXn3GsGd6fi5_pD_DB_kXu4-6wbQ=w768-rw", "https://lh3.googleusercontent.com/dWhPAw4uGogNfkVfjtfDYi7RE9bEQwCuRQ_81pSdk2Cx48VTDIesrH9mAWtwINhcMBapRP9GUgJEiynE_M7cY3zarQ1tnBeEgoHJITDr4g=w768-rw"] },
    { id: 5, title: 'Black t-shirt MW', price: 1500, description: 'Плотная оверсайз футболка', img: "https://lh3.googleusercontent.com/8KflzhruQR1SK947FnHrg2OvtcHzBFVK4om7pkor7OuJPhx-Ix1A3AeGVmWU8iEPWZovGKWLrhUyBbJkythaelZkvgiwMLrOHpbg8U2j=w768-rw", category: "Футболки", images: ["https://lh3.googleusercontent.com/8KflzhruQR1SK947FnHrg2OvtcHzBFVK4om7pkor7OuJPhx-Ix1A3AeGVmWU8iEPWZovGKWLrhUyBbJkythaelZkvgiwMLrOHpbg8U2j=w768-rw", "https://lh3.googleusercontent.com/uweylZ-0lf3P5LRg6ffSNfHMNs0YV3_g5I6k6Xs8TJqIemxxz65b5EojGnPI6L7h0eNzypoBdpi6ElZKsUyn9YAQdm84CZWl_wN2AI9IpuQ=w768-rw", "https://lh3.googleusercontent.com/uncMPKTSmqW6QCaLGz96xGjEuby6EAexKI-9Ab_QbwAmjF5NOxFsIVdYaSecbpntggjauE-S5YbivQaEqwLzEj_XU9QJMzvhOv2YaDcJ=w768-rw", "https://lh3.googleusercontent.com/FC2RoHy2bblvkYAHdsWSdexk4SuHK9VYwflWHlnARnX5n7hL9F4JnYv8PYCYf4ie4c4V9KQ8NsJLK7qJmybiN8SoFOYqxHg-c0-Z_lrJmB0=w768-rw", "https://lh3.googleusercontent.com/NgVQIny6ZiqKeDPqEcrurYwFsyLu9VRRWHc4DKoHsW6hTYUxtdhEgZ1qxuSX43Kzp4Cv3eCSSrhwfcshGGM8aT04s2_Xr3qGBi33YiJ3=w768-rw"] },
    { id: 6, title: 'Dark blue t-shirt MW', price: 1500, description: 'Плотная оверсайз футболка', img: "https://lh3.googleusercontent.com/WA66pSBbtPevJLjpLI39OXWTSDMPsqDrdGiNbTRVt287HI_QoiB3_6H4dLXWeNM5Xab6hparI_-BvFMsxVx4050La7R0jBXp3zl4mU1q_w=w768-rw", category: "Футболки", images: ["https://lh3.googleusercontent.com/WA66pSBbtPevJLjpLI39OXWTSDMPsqDrdGiNbTRVt287HI_QoiB3_6H4dLXWeNM5Xab6hparI_-BvFMsxVx4050La7R0jBXp3zl4mU1q_w=w768-rw", "https://lh3.googleusercontent.com/U53EbTL5huVP08Wv8-IGK1BtSrtQdU9T5TwozjYHlsLuCFSWgMBdUWAmszdd5oPnL3LbUeJ2X480cm5h9hIvu5OZmjBE7eNS7aUT7RIKgA=w768-rw", "https://lh3.googleusercontent.com/rd30aYavy8JaBfha-wI9gqDoFktoVpvMcHtBScGHrJei8dV8nG4x9koYB0_RYuA2Bw4F2JRDLavLt1Rb-hvFNh6qtGWwIxQH5LpdgGNZbQ=w768-rw", "https://lh3.googleusercontent.com/D3GbdJXZLvm59erE0Ad0SddFyDvyqwpyK24pC0W1eH0XFMWYbahv4yJRRMinn2tqPNynY0Waa94KVC4dXJfAwYPSg6p49jbi1PX_Lt50jQ=w768-rw", "https://lh3.googleusercontent.com/UdlNS4_P4wJKP4_fKPiyDtJ2Fa9E-srGL_f5tkogclSW77AnDu5seL5hW3Z0QMfQ7O_1FJQx-mL1eajTRopsgN39Rm7HVu1mamKDti7sics=w768-rw"] },
    { id: 7, title: 'White t-shirt WW', price: 1500, description: 'Плотная оверсайз футболка', img: "https://lh3.googleusercontent.com/pIy_m2l8FtcOQFBL9S4vvxOJWxxPkPcCmm4LHhpZwTV5xVJU30HVia2wL5PziEKr4y9UYVEdexD88PmjmNcP8m5rNNxS48NziigzdEyhhg=w768-rw", category: "Футболки", images: ["https://lh3.googleusercontent.com/pIy_m2l8FtcOQFBL9S4vvxOJWxxPkPcCmm4LHhpZwTV5xVJU30HVia2wL5PziEKr4y9UYVEdexD88PmjmNcP8m5rNNxS48NziigzdEyhhg=w768-rw", "https://lh3.googleusercontent.com/0TJMv0Hog1489t9AVoo1zzfOIEgvgoDgpZrI81q7GHS6cftr_E5sblT3-ph8l188DuIpKkV04ctwPLycVgoDcrfRU7YHtJEAZjOmvwz1Eg=w768-rw", "https://lh3.googleusercontent.com/0R82DyyU0K_5_SSSqr88diPIQDkgBmI1i7vruebEDXIuRFlkMZPc1UBgbjsJqAgjewDRGqC8V4t1xTLjbFoGkhSbGj0NkZs4W5nWAsY=w768-rw", "https://lh3.googleusercontent.com/G3gmnWR6tsthegCd_ZBxRSha9J4_xYaqJ3OwX02B0M7OwE7JONQKOQK6wpPlmPmJV-EgFmw3U0pa9dYLrkezStpJuc42VSU2LQm71U1ZAQ=w768-rw", "https://lh3.googleusercontent.com/5O3-WWknqLPFkZgLotn8HuSQsGXXfeIIcgGI9oljAW0j7ow6oZRbNAy0K_18RsGYSb5_sYsDrxmxDwYz_uJbAJ1Pvijo5zUkwrpmkFGwag=w768-rw"] }
];

const ProductList = () => {
    const { tg } = useTelegram();
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const goBack = () => {
        navigate('/');
    }
    const [selectedCategory, setSelectedCategory] = useState('Все');

    useEffect(() => {
        tg.MainButton.show();

        const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);

        tg.MainButton.setParams({
            text:` Перейти в корзину (${totalCount})`
        });

        const onMainButtonClick = () => {
            navigate('/order');
        };

        tg.onEvent('mainButtonClicked', onMainButtonClick);

        return () => {
            tg.offEvent('mainButtonClicked', onMainButtonClick);
        };
    }, [tg, cartItems]);

    // Фильтруем товары по выбранной категории
    const filteredProducts = selectedCategory === 'Все'
        ? products
        : products.filter(product => product.category === selectedCategory);

    // Функция для определения стиля кнопки
    const getButtonStyle = (category) => {
        return selectedCategory === category
            ? { backgroundColor: '#071E57', color: '#F2EDEA' }
            : {};
    };

    return (
        <div className="product-list">
            <button className="back" onClick={goBack}>&lt; назад</button>
            <div className="category-buttons">
                <button
                    className={'category-button'}
                    style={getButtonStyle('Футболки')}
                    onClick={() => setSelectedCategory('Футболки')}
                >
                    Футболки
                </button>
                <button
                    className={'category-button'}
                    style={getButtonStyle('Худи')}
                    onClick={() => setSelectedCategory('Худи')}
                >
                    Худи
                </button>
                <button
                    className={'category-button'}
                    style={getButtonStyle('Все')}
                    onClick={() => setSelectedCategory('Все')}
                >
                    Весь каталог
                </button>
            </div>

            <div className="list">
                {filteredProducts.map(item => (
                    <Link to={`/ProductPage/${item.id}`} key={item.id} className="item">
                        <img className={'image'} src={item.img} alt={item.title}/>
                        <h2>{item.title}</h2>
                        <div className={'size-prise'}>
                            <span className={'size'}>s/m/l/xl</span>
                            <span className={"item-price"}>Цена: ₽{item.price}</span>
                        </div>
                        <button className={'add-to-cart-button'}>Добавить в корзину</button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;