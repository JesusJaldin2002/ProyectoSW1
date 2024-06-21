@extends('layouts.app')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/chat.css') }}">
@endsection

@section('scripts2')
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"
        integrity="sha384-2huaZvOR9iDzHqslqwpR87isEmrfxqyWOF7hr7BY6KG0+hVKLoEXMPUJw3ynWuhO" crossorigin="anonymous">
    </script>
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Este es el chat {{ $chat->id }}</div>

                    <div class="card-body chat-body">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif

                        <!-- Mensajes del chat -->
                        <div class="chat-message left">
                            <div class="message-content">
                                Mensaje de la otra persona
                            </div>
                            <span class="message-time">10:30 AM</span>
                        </div>
                        <div class="chat-message right">
                            <div class="message-content">
                                Mi mensaje
                            </div>
                            <span class="message-time">10:31 AM</span>
                        </div>
                        <div class="chat-message left">
                            <div class="message-content">
                                Otro mensaje de la otra persona
                            </div>
                            <span class="message-time">10:32 AM</span>
                        </div>
                        <div class="chat-message right">
                            <div class="message-content">
                                Otro de mis mensajes
                            </div>
                            <span class="message-time">10:33 AM</span>
                        </div>

                        <!-- Formulario de envío -->
                        <form method="POST" action="" class="chat-form">
                            @csrf
                            <div class="input-group">
                                <textarea class="form-control" name="message" placeholder="Escribir..." rows="1"></textarea>
                                <button class="btn btn-primary" type="submit">Enviar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        const socket = io('http://localhost:808');
    </script>
@endsection
