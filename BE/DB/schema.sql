--
-- PostgreSQL database dump
--

\restrict njeb9BtmKjrfhVphMWZe4J15gHY9TnhpcdgVmEr9CzmuHJOoqekvkrBwc3aGBD6

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: folder_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.folder_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.folder_status OWNER TO root;

--
-- Name: folder_type; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.folder_type AS ENUM (
    'PROJECT',
    'AREA',
    'RESOURCE',
    'ARCHIVE'
);


ALTER TYPE public.folder_type OWNER TO root;

--
-- Name: task_status; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.task_status AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE',
    'CANCELLED'
);


ALTER TYPE public.task_status OWNER TO root;

--
-- Name: touch_updated_at(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.touch_updated_at() OWNER TO root;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: folders; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.folders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type public.folder_type NOT NULL,
    status public.folder_status DEFAULT 'ACTIVE'::public.folder_status,
    target_outcome text,
    due_date timestamp without time zone,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


ALTER TABLE public.folders OWNER TO root;

--
-- Name: note_blocks; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.note_blocks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    note_id uuid NOT NULL,
    block_type character varying(50) NOT NULL,
    content jsonb NOT NULL,
    "position" double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.note_blocks OWNER TO root;

--
-- Name: note_tags; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.note_tags (
    note_id uuid NOT NULL,
    tag_id uuid NOT NULL
);


ALTER TABLE public.note_tags OWNER TO root;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.notes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    folder_id uuid NOT NULL,
    title text NOT NULL,
    distill_level smallint DEFAULT 1,
    source_url text,
    version integer DEFAULT 1,
    last_interacted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


ALTER TABLE public.notes OWNER TO root;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    color character varying(10),
    created_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tags OWNER TO root;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    folder_id uuid NOT NULL,
    note_id uuid,
    title text NOT NULL,
    status public.task_status DEFAULT 'TODO'::public.task_status,
    priority smallint DEFAULT 2,
    "position" double precision,
    due_date timestamp without time zone,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


ALTER TABLE public.tasks OWNER TO root;

--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    is_verified boolean DEFAULT false,
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO root;

--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- Name: note_blocks note_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.note_blocks
    ADD CONSTRAINT note_blocks_pkey PRIMARY KEY (id);


--
-- Name: note_tags note_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT note_tags_pkey PRIMARY KEY (note_id, tag_id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_user_id_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_user_id_name_key UNIQUE (user_id, name);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_note_blocks_note_position; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_note_blocks_note_position ON public.note_blocks USING btree (note_id, "position");


--
-- Name: idx_notes_folder_interacted; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_notes_folder_interacted ON public.notes USING btree (folder_id, last_interacted_at);


--
-- Name: idx_tags_user; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_tags_user ON public.tags USING btree (user_id);


--
-- Name: idx_tasks_folder_status; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_tasks_folder_status ON public.tasks USING btree (folder_id, status);


--
-- Name: folders trg_folders_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_folders_updated BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


--
-- Name: notes trg_notes_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


--
-- Name: tasks trg_tasks_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


--
-- Name: users trg_users_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


--
-- Name: folders folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: note_blocks note_blocks_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.note_blocks
    ADD CONSTRAINT note_blocks_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: note_tags note_tags_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT note_tags_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: note_tags note_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT note_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: notes notes_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE CASCADE;


--
-- Name: tags tags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict njeb9BtmKjrfhVphMWZe4J15gHY9TnhpcdgVmEr9CzmuHJOoqekvkrBwc3aGBD6

