import React, { useEffect, useState } from 'react';
import ContentService from '../services/content.service';
import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import '../App.css';
import { IMAGE_URL } from '../constants/apis';
import searchIcon from '../assets/search.png';
import cancelIcon from '../assets/cancel.png';

function ContentListing() {

    const [pageTitle, setPageTitle] = useState("")
    const [contentList, setContentList] = useState([])
    const [filterList, setFilterList] = useState([])
    const [loading, setLoading] = useState(false)
    const [sticky, setSticky] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [showSearch, setShowSearch] = useState(false);
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        fetchData(pageNo)
    }, [pageNo])

    useEffect(() => {
        if(searchWord){
            const updatedList = contentList.filter((content) => content.name?.includes(searchWord))
            setFilterList(updatedList)
        } else {
            setFilterList(contentList)
        }
    }, [searchWord, contentList])

    const fetchData = async (pageNo) => {
        setLoading(true)
        try {
            const response = await ContentService.getDataList(pageNo)
            if (pageNo === 1) {
                setPageTitle(response?.title)
                setContentList(response['content-items']?.content);
            } else {
                const updatedList = contentList.concat(response['content-items']?.content)
                setContentList(updatedList);
            }
            if (response['page-size-requested'] === response['page-size-returned']) {
                setPageNo(pageNo + 1)
            }

            setLoading(false)
        } catch (error) {
            console.log("error ", error)
            // this.setState({ error, isLoading: false });
        }
    }

    // on render, set listener
    useEffect(() => {
        window.addEventListener("scroll", isSticky);
        return () => {
            window.removeEventListener("scroll", isSticky);
        };
    }, []);

    const isSticky = () => {
        /* Method that will fix header after a specific scrollable */
        const scrollTop = window.scrollY;
        const stickyClass = scrollTop >= 20 ? "is-sticky" : "";
        setSticky(stickyClass);
    };

    const classes = `header-section d-none d-xl-block ${sticky}`;

    return (
        <div className="container">
            {
                showSearch ?
                    <div className={classes}>
                        <input className="input-box" placeholder="Type Here" onChange={(e) => setSearchWord(e.target.value)} value={searchWord} />
                        <img src={cancelIcon} className="searchIcon" alt="close" onClick={() => setShowSearch(false)} />
                    </div>

                    :
                    <div className={classes}>
                        <h3 >{pageTitle}</h3>
                        <img src={searchIcon} className="searchIcon" alt="search" onClick={() => setShowSearch(true)} />
                    </div>
            }

            <ImageList rowHeight={160} className="gridList" cols={3}>
                {filterList.map((tile, index) => (
                    <ImageListItem key={index} cols={tile.cols || 1}>
                        <img src={`${IMAGE_URL}/${tile['poster-image']}`} alt={tile.name} />
                        <p>{tile.name}</p>
                        <ImageListItemBar
                            title={tile.name}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}

export default ContentListing;
