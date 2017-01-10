import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import Header from 'components/Header'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import NextPrev from 'pages/projekte/_next-prev.js'
import Image from 'components/ResponsiveImage'

import './project-list.less'

export default class ProjectTemplate extends React.Component {

    constructor() {
        super()
        if (typeof window !== 'undefined') {
            this.state = { windowWidth: window.innerWidth };
        } else {
            this.state = { windowWidth: 700 };
        }
    }

    componentDidMount () {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize);
        }
    }

    componentWillUnmount () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    handleResize () {
        if (typeof window !== 'undefined') {
            this.setState({windowWidth: window.innerWidth});
        }
    }

    render () {
        const projectList = [];
        const currentPath = '/projekte/'
        let classNames = 'vo_project_list-item';

        const projects = this.props.route.pages.filter((page) => {
            return page.path.substr(0, currentPath.length) === currentPath && page.path !== currentPath
        }).sort((a, b) => {
            return (a.data.order < b.data.order) ? 1 : (a.data.order > b.data.order) ? -1 : 0
        })

        projects.forEach((page) => {
            const subDir = page.path.replace(currentPath, '')
            let gallery;
            let classNamesItem = classNames;

            const backgroundImage = {
                backgroundImage: `url(${page.path}${page.data.mainImage})`
            }

            if (this.props.location.pathname !== currentPath) {
                classNamesItem += (this.props.location.pathname === page.path) ? ' active' : ' passive';
            } else {
                classNamesItem += ' listed'
            }

            if (page.data.images && this.props.location.pathname === page.path) {
                const galleryImages = page.data.images.map((image) => {
                    if (image.vimeo) {
                        return (
                            <li key={image}>
                                <div className="embed_container">
                                    <iframe 
                                        src={image.vimeo} 
                                        frameBorder='0' 
                                        allowFullScreen />
                                </div>
                            </li>
                        )
                    }
                    return (
                        <li key={image}>
                            <Image location={page.path} source={image} />
                        </li>
                    )
                })

                const nextProject = projects.find((project, index, projects) => {
                    const prevIndex = mod((index + 1), projects.length)
                    return page.path === projects[prevIndex].path
                })

                const prevProject = projects.find((project, index, projects) => {
                    const prevIndex = mod((index - 1), projects.length)
                    return page.path === projects[prevIndex].path
                })

                gallery = (
                    <footer>
                        <ul className="vo_project_gallery">
                            {galleryImages}
                        </ul>

                        <NextPrev next={nextProject} prev={prevProject} />
                    </footer>
                )
            }

            const crossRotation = Math.atan(350 / this.state.windowWidth) * (180 / Math.PI)

            const crossTransform = {transform: 'rotate(' + crossRotation + 'deg)'}
            const crossTransform2 = {transform: 'rotate(-' + crossRotation + 'deg)'}

            projectList.push(
                <li className={classNamesItem}
                    key={page.path}>
                    <Link to={prefixLink(page.path)}
                        className="vo_project_list-link">
                        mehr infos
                    </Link>
                    <Image location={page.path} source={page.data.mainImage} className="vo_project_list-main_image"/>
                    <div className="vo-section_wrapper">
                        <div className="vo_project_list-section vo-section vo-section--half">
                            <h2>{page.data.title}</h2>
                            <div>{page.data.description}</div>
                            <div className="vo-trenner"/>
                            <div>{page.data.date}</div>
                            <div>{page.data.what}</div>
                            <div className="vo-trenner"/>
                            <div>{page.data.what2}</div>
                            {
                                page.data.link ? 
                                <span className="vo_project-link">
                                    <div className="vo-trenner" />
                                    <div>
                                        website:&nbsp;
                                        <a href={page.data.link.href}>
                                            {page.data.link.title}
                                        </a>
                                    </div>
                                </span> 
                                : null
                            }
                            <div className="vo_project-full_text">
                                <div className="vo-trenner"/>
                                <div className="vo_project_list-body"
                                    dangerouslySetInnerHTML={{ __html: page.data.body }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cross cross--1"
                        style={crossTransform} />
                    <div className="cross cross--2"
                        style={crossTransform2}  />

                    {gallery}

                </li>
            )
        })

        return (
            <DocumentTitle title={`${config.siteTitle} | projekte`}>
                <main>
                    <ul className="vo_project_list">
                        {projectList}
                    </ul>
                </main>
            </DocumentTitle>
        )
    }
}

function mod(n, m) {
        return ((n % m) + m) % m;
}
