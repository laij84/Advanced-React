import Item from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: 'abc123',
    title: 'a cool item',
    price: 5000,
    description: 'super cool item',
    image: 'dog.jpg',
    largeImage: 'largedog.jpg'
}

describe('<Item/>', () => {
    // it('renders and displays properly', ()=> {
    //     const wrapper = shallow(<Item item={fakeItem}/>)
    //     const PriceTag = wrapper.find('PriceTag');
    //     console.log(PriceTag.children().text());
    //     expect(PriceTag.children().text()).toBe('£50');
    // });

    // it('renders the title and img', () => {
    //     const wrapper = shallow(<Item item={fakeItem}/>)
    //     expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    //     const img = wrapper.find('img');
    //     console.log(img.props());
    //     expect(img.props().src).toBe(fakeItem.image);
    //     expect(img.props().alt).toBe(fakeItem.title);
    // });

    // it('renders the buttons', ()=> {
    //     const wrapper = shallow(<Item item={fakeItem}/>)
    //     const buttonList = wrapper.find('.buttonList');
    //     expect(buttonList.children().length).toBe(3);
    //     expect(buttonList.find('Link').exists()).toBeTruthy;
    //     expect(buttonList.find('AddToCart').exists()).toBeTruthy;
    //     expect(buttonList.find('DeleteItem').exists()).toBeTruthy;
    // })

    it('renders and matches snapshot', () => {
        const wrapper = shallow(<Item item={fakeItem}/>)
        expect(toJSON(wrapper)).toMatchSnapshot();
    })
})
