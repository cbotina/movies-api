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
2	The Terrifier II	El payaso Art resucita en la morgue. Un año después, en la noche de Halloween, el siniestro psicópata vuelve al condado de Miles para atacar a unos hermanos adolescentes cuyo difunto padre les legó un libro con bocetos premonitorios sobre Art.	https://pics.filmaffinity.com/Terrifier_2-139025282-large.jpg	5	https://www.youtube.com/watch?v=UOrNESb8T4I	5	20	75	f
5	The Terminator	A cyborg assassin is sent back in time to kill Sarah Connor, the woman whose unborn son will become humanity's only hope in a future war against machines.	https://upload.wikimedia.org/wikipedia/en/7/70/Terminator1984movieposter.jpg	13	https://www.youtube.com/watch?v=frdj1zb9sMY	5	20	100	t
1	The Whale	A morbidly obese and reclusive English instructor, teaches online writing courses but keeps his webcam off, ashamed of his physical appearance.	https://m.media-amazon.com/images/M/MV5BZDQ4Njg4YTctNGZkYi00NWU1LWI4OTYtNmNjOWMyMjI1NWYzXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg	0	https://www.youtube.com/watch?v=D30r0CwtIKc	7	20	55	t
6	The Shining	A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.	https://upload.wikimedia.org/wikipedia/en/4/4d/The_Shining_%281980%29_UK_theatrical_poster.jpg	7	https://www.youtube.com/watch?v=S014oGZiSdI	4	15	90	t
7	Die Hard	An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.	https://upload.wikimedia.org/wikipedia/en/7/7e/Die_hard.jpg	12	https://www.youtube.com/watch?v=2TQ-pOvI6Xo	6	25	80	t
8	The Exorcist	When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.	https://upload.wikimedia.org/wikipedia/en/5/5a/Exorcist-poster-d.jpg	6	https://www.youtube.com/watch?v=YDGw1MTEe9k	3	12	70	t
9	Predator	A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.	https://upload.wikimedia.org/wikipedia/en/9/95/Predator_Movie.jpg	9	https://www.youtube.com/watch?v=Y1txEAywdiw	5	18	85	t
10	The Nightingale	In 1825, Clare, a young Irish convict, chases a British officer through the rugged Tasmanian wilderness	https://pics.filmaffinity.com/the_nightingale-365512699-large.jpg	3	https://www.youtube.com/watch?v=7Nf2CispZf0	6	25	63	t
11	Dune	Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.	https://pics.filmaffinity.com/dune-296883364-large.jpg	2	https://www.youtube.com/watch?v=8g18jFHCLXk	8	30	92	t
12	No Time to Die	James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.	https://pics.filmaffinity.com/no_time_to_die-482588847-large.jpg	4	https://www.youtube.com/watch?v=L3kYuLj5UTA	10	35	85	t
13	The French Dispatch	A love letter to journalists set in an outpost of an American newspaper in a fictional 20th-century French city that brings to life a collection of stories published in The French Dispatch magazine.	https://pics.filmaffinity.com/the_french_dispatch-995476288-large.jpg	1	https://www.youtube.com/watch?v=TcPk2p0Zaw4	7	28	51	t
14	Cruella	A live-action prequel feature film following a young Cruella de Vil.	https://pics.filmaffinity.com/Cruella-696692897-large.jpg	6	https://www.youtube.com/watch?v=jpZrVxv_8hc	9	32	77	t
4	Terrifier II	A live-action prequel feature film following a young Cruella de Vil.	https://pics.filmaffinity.com/Cruella-696692897-large.jpg	6	https://www.youtube.com/watch?v=jpZrVxv_8hc	9	32	77	t
\.


--
-- Data for Name: movie_tags_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_tags_tag ("movieId", "tagId") FROM stdin;
2	3
6	5
\.


--
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental (id, "rentalDate", "dueDate", "returnDate", status, "userId", "movieId") FROM stdin;
14	2023-03-31	2023-04-01	\N	active	2	1
15	2023-03-31	2023-04-01	\N	active	2	1
16	2023-03-31	2023-04-01	\N	active	2	1
17	2023-03-31	2023-04-03	2023-03-31	returned	3	5
\.


--
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sale (id, quantity, "datePurchased", "userId", "movieId") FROM stdin;
1	1	2023-03-31	3	1
2	1	2023-03-31	3	1
3	1	2023-03-31	3	4
4	1	2023-03-31	3	4
5	1	2023-03-31	3	4
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, name) FROM stdin;
1	action
2	adventures
3	horror
4	clowns
5	drama
\.


--
-- Data for Name: user_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_table (id, name, surname, email, password, balance, role) FROM stdin;
1	admin	admin	admin@applaudostudios.com	$2b$10$syJ94a5bZ7nSnRjrYEm/O.PiYHZPuRkNOSmZ1Oxm.uGUVbsoNIuBG	0	admin
2	Carlos	Botina	cbotina@applaudostudios.com	$2b$10$VUp1aLV.HI/BCdXvRMgqyu.w9yjfznYHmmf3s157wghH5sg0UI2AW	65	client
3	Random	User	randomuser@applaudostudios.com	$2b$10$EZGlpgCxAgjSNtSeJOh8eeB5Jvs.416xyowhR3o5NfStGwm8IUiOC	6	client
\.


--
-- Name: movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movie_id_seq', 15, true);


--
-- Name: rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_id_seq', 17, true);


--
-- Name: sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_id_seq', 5, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 5, true);


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

