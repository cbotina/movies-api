--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: rental_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rental_status_enum AS ENUM (
    'active',
    'returned'
);


ALTER TYPE public.rental_status_enum OWNER TO postgres;

--
-- Name: user_table_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_table_role_enum AS ENUM (
    'admin',
    'client'
);


ALTER TYPE public.user_table_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    "posterLink" character varying NOT NULL,
    stock integer NOT NULL,
    "trailerLink" character varying NOT NULL,
    "rentPrice" integer NOT NULL,
    "salePrice" integer NOT NULL,
    likes integer NOT NULL,
    availability boolean NOT NULL
);


ALTER TABLE public.movie OWNER TO postgres;

--
-- Name: movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movie_id_seq OWNER TO postgres;

--
-- Name: movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;


--
-- Name: movie_tags_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_tags_tag (
    "movieId" integer NOT NULL,
    "tagId" integer NOT NULL
);


ALTER TABLE public.movie_tags_tag OWNER TO postgres;

--
-- Name: rental; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental (
    id integer NOT NULL,
    "rentalDate" date NOT NULL,
    "dueDate" date NOT NULL,
    "returnDate" date,
    status public.rental_status_enum DEFAULT 'active'::public.rental_status_enum NOT NULL,
    "userId" integer,
    "movieId" integer
);


ALTER TABLE public.rental OWNER TO postgres;

--
-- Name: rental_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_id_seq OWNER TO postgres;

--
-- Name: rental_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rental_id_seq OWNED BY public.rental.id;


--
-- Name: sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "datePurchased" date NOT NULL,
    "userId" integer,
    "movieId" integer
);


ALTER TABLE public.sale OWNER TO postgres;

--
-- Name: sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_id_seq OWNER TO postgres;

--
-- Name: sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_id_seq OWNED BY public.sale.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO postgres;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: user_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_table (
    id integer NOT NULL,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    balance integer DEFAULT 0 NOT NULL,
    "resetPasswordToken" uuid,
    role public.user_table_role_enum DEFAULT 'client'::public.user_table_role_enum NOT NULL
);


ALTER TABLE public.user_table OWNER TO postgres;

--
-- Name: user_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_table_id_seq OWNER TO postgres;

--
-- Name: user_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_table_id_seq OWNED BY public.user_table.id;


--
-- Name: movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);


--
-- Name: rental id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental ALTER COLUMN id SET DEFAULT nextval('public.rental_id_seq'::regclass);


--
-- Name: sale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale ALTER COLUMN id SET DEFAULT nextval('public.sale_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Name: user_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table ALTER COLUMN id SET DEFAULT nextval('public.user_table_id_seq'::regclass);


--
-- Data for Name: movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie (id, title, description, "posterLink", stock, "trailerLink", "rentPrice", "salePrice", likes, availability) FROM stdin;
3	The Shining	A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.	https://upload.wikimedia.org/wikipedia/en/4/4d/The_Shining_%281980%29_UK_theatrical_poster.jpg	7	https://www.youtube.com/watch?v=S014oGZiSdI	4	15	90	t
7	The Nightingale	In 1825, Clare, a young Irish convict, chases a British officer through the rugged Tasmanian wilderness, bent on revenge for a terrible act of violence he committed against her family.	https://pics.filmaffinity.com/the_nightingale-365512699-large.jpg	3	https://www.youtube.com/watch?v=7Nf2CispZf0	6	25	63	t
9	No Time to Die	James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.	https://pics.filmaffinity.com/no_time_to_die-482588847-large.jpg	4	https://www.youtube.com/watch?v=L3kYuLj5UTA	10	35	85	t
12	The Godfather	The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.	https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg	5	https://www.youtube.com/watch?v=sY1S34973zA	3	15	95	t
13	The Silence of the Lambs	A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.	https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg	3	https://www.youtube.com/watch?v=W6Mm8Sbe__o	4	20	89	t
14	Star Wars: A New Hope	Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.	https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg	8	https://www.youtube.com/watch?v=1g3_CFmnU7k	6	25	93	t
15	The Matrix	A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.	https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg	9	https://www.youtube.com/watch?v=m8e-FF8MsqU	5	22	87	t
16	Jurassic Park	During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.	https://upload.wikimedia.org/wikipedia/en/9/93/Jurassic_Park_%28franchise_logo%29.png	7	https://www.youtube.com/watch?v=lc0UehYemQA	4	18	80	t
11	Cruella	A live-action prequel feature film following a young Cruella de Vil.	https://pics.filmaffinity.com/Cruella-696692897-large.jpg	0	https://www.youtube.com/watch?v=jpZrVxv_8hc	9	32	77	t
2	The Terminator	A cyborg assassin is sent back in time to kill Sarah Connor, the woman whose unborn son will become humanity's only hope in a future war against machines.	https://upload.wikimedia.org/wikipedia/en/7/70/Terminator1984movieposter.jpg	4	https://www.youtube.com/watch?v=frdj1zb9sMY	5	20	100	t
6	Predator	A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.	https://upload.wikimedia.org/wikipedia/en/9/95/Predator_Movie.jpg	8	https://www.youtube.com/watch?v=Y1txEAywdiw	5	18	85	t
10	The French Dispatch	A love letter to journalists set in an outpost of an American newspaper in a fictional 20th-century French city that brings to life a collection of stories published in The French Dispatch magazine.	https://pics.filmaffinity.com/the_french_dispatch-995476288-large.jpg	0	https://www.youtube.com/watch?v=TcPk2p0Zaw4	7	28	51	t
5	The Exorcist	When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.	https://upload.wikimedia.org/wikipedia/en/5/5a/Exorcist-poster-d.jpg	0	https://www.youtube.com/watch?v=YDGw1MTEe9k	3	12	70	t
4	Die Hard	An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.	https://upload.wikimedia.org/wikipedia/en/7/7e/Die_hard.jpg	11	https://www.youtube.com/watch?v=2TQ-pOvI6Xo	6	25	80	t
18	random	description	www.link.com	5	www.trailer.com	2	3	23	t
8	Dune	Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.	https://pics.filmaffinity.com/dune-296883364-large.jpg	2	https://www.youtube.com/watch?v=8g18jFHCLXk	8	30	92	t
19	The Godfather	The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.	https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg	5	https://www.youtube.com/watch?v=sY1S34973zA	3	15	95	t
20	The Silence of the Lambs	A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.	https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg	3	https://www.youtube.com/watch?v=W6Mm8Sbe__o	4	20	89	t
21	Star Wars: A New Hope	Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.	https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg	8	https://www.youtube.com/watch?v=1g3_CFmnU7k	6	25	93	t
22	The Matrix	A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.	https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg	9	https://www.youtube.com/watch?v=m8e-FF8MsqU	5	22	87	t
23	Jurassic Park	During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.	https://upload.wikimedia.org/wikipedia/en/9/93/Jurassic_Park_%28franchise_logo%29.png	7	https://www.youtube.com/watch?v=lc0UehYemQA	4	18	80	t
24	Toy Story	A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.	https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg	10	https://www.youtube.com/watch?v=KYz2wyBy3kc	2	10	88	t
25	The Lion King	Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.	https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg	8	https://www.youtube.com/watch?v=4sj1MT05lAA	3	12	92	t
27	E.T. the Extra-Terrestrial	A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.	https://upload.wikimedia.org/wikipedia/en/6/66/E_t_the_extra_terrestrial_ver3.jpg	3	https://www.youtube.com/watch?v=qYAETtIIClk	2	10	87	t
28	District 9	An extraterrestrial race forced to live in slum-like conditions on Earth suddenly finds a kindred spirit in a government agent who is exposed to their biotechnology.	https://upload.wikimedia.org/wikipedia/en/d/df/District_nine_ver2.jpg	4	https://www.youtube.com/watch?v=DyLUwOcR5pk	3	12	64	t
30	Superbad	Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.	https://upload.wikimedia.org/wikipedia/en/8/8b/Superbad_Poster.png	6	https://www.youtube.com/watch?v=MNpoTxeydiY	3	8	73	t
29	Arrival	A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.	https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg	0	https://www.youtube.com/watch?v=ZLO4X6UI8OY	4	18	91	t
26	Finding Nemo	After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.	https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg	11	https://www.youtube.com/watch?v=wZdpNglLbt8	2	11	87	t
1	The return of the one who never left	This is a heart-wrenching drama that tells the story of a woman named Sarah who disappeared without a trace 10 years ago.	google.com/images	8	https://www.youtube.com/watch?v=S014oGZiSdI	2	10	100	t
\.


--
-- Data for Name: movie_tags_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_tags_tag ("movieId", "tagId") FROM stdin;
1	1
1	2
1	3
2	4
2	5
3	1
4	4
5	6
6	4
6	5
6	7
12	1
16	8
24	8
25	8
26	8
27	8
27	7
28	7
29	7
29	4
29	1
30	2
\.


--
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental (id, "rentalDate", "dueDate", "returnDate", status, "userId", "movieId") FROM stdin;
1	2023-04-06	2023-04-07	\N	active	2	1
2	2023-04-06	2023-04-08	\N	active	2	2
\.


--
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sale (id, quantity, "datePurchased", "userId", "movieId") FROM stdin;
1	2	2023-04-06	2	29
2	1	2023-04-06	2	26
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, name) FROM stdin;
1	drama
2	comedy
3	adventures
4	action
5	sci-fi
6	horror
7	aliens
8	familiar
9	random
10	tag
\.


--
-- Data for Name: user_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_table (id, name, surname, email, password, balance, "resetPasswordToken", role) FROM stdin;
1	ADMIN	admin	admin@applaudostudios.dev	$2b$10$imYIxcltFZZTCoHR/UFCxu9upvTbmLSecnCBhQsAeGkRpBosuFlNC	0	\N	admin
3	John	Doe	johndoe@applaudostudios.dev	$2b$10$A6NrVF5tiOxc4X8xt89eOeYFjUqncTXIcx/mMR.AAtiIF28B/bFSS	25	\N	client
2	Carlos	Botina	carlosal.botina@umariana.edu.co	$2b$10$5B2cwiZtQt6ktMrtD4c5TeO7kR1jApjK3Wx8BiOb7Vz6ZMiKaaORq	875	\N	client
\.


--
-- Name: movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movie_id_seq', 30, true);


--
-- Name: rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_id_seq', 2, true);


--
-- Name: sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_id_seq', 2, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 10, true);


--
-- Name: user_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_table_id_seq', 3, true);


--
-- Name: user_table PK_1e3ed533dd87e54f8de2a912187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT "PK_1e3ed533dd87e54f8de2a912187" PRIMARY KEY (id);


--
-- Name: tag PK_8e4052373c579afc1471f526760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id);


--
-- Name: rental PK_a20fc571eb61d5a30d8c16d51e8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY (id);


--
-- Name: movie_tags_tag PK_a63fb1cc6083d9417e67029dece; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_tags_tag
    ADD CONSTRAINT "PK_a63fb1cc6083d9417e67029dece" PRIMARY KEY ("movieId", "tagId");


--
-- Name: movie PK_cb3bb4d61cf764dc035cbedd422; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY (id);


--
-- Name: sale PK_d03891c457cbcd22974732b5de2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY (id);


--
-- Name: user_table UQ_08a1b4f87aba79a8f7b13ed817e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT "UQ_08a1b4f87aba79a8f7b13ed817e" UNIQUE ("resetPasswordToken");


--
-- Name: IDX_5c229532ab9c842d9f712c44a4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5c229532ab9c842d9f712c44a4" ON public.movie_tags_tag USING btree ("movieId");


--
-- Name: IDX_7f5d867068b30d8263854b3e98; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7f5d867068b30d8263854b3e98" ON public.movie_tags_tag USING btree ("tagId");


--
-- Name: sale FK_0b57de2dd7e017af3e07ce6c4b9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT "FK_0b57de2dd7e017af3e07ce6c4b9" FOREIGN KEY ("movieId") REFERENCES public.movie(id);


--
-- Name: rental FK_2f2be23e8f7d76f14807c7564e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT "FK_2f2be23e8f7d76f14807c7564e8" FOREIGN KEY ("movieId") REFERENCES public.movie(id);


--
-- Name: movie_tags_tag FK_5c229532ab9c842d9f712c44a4d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_tags_tag
    ADD CONSTRAINT "FK_5c229532ab9c842d9f712c44a4d" FOREIGN KEY ("movieId") REFERENCES public.movie(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rental FK_5c91d10c5ee7afddcb2dbbfbbd0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0" FOREIGN KEY ("userId") REFERENCES public.user_table(id) ON DELETE CASCADE;


--
-- Name: movie_tags_tag FK_7f5d867068b30d8263854b3e98d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_tags_tag
    ADD CONSTRAINT "FK_7f5d867068b30d8263854b3e98d" FOREIGN KEY ("tagId") REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sale FK_bf176f13c0bce3c693b24523794; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT "FK_bf176f13c0bce3c693b24523794" FOREIGN KEY ("userId") REFERENCES public.user_table(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

