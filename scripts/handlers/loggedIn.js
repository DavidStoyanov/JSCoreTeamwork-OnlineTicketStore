handlers.viewTickets = function (ctx) {
    ticketsService.loadAllTickets()
        .then(successLoadTickets)
        .catch(auth.handleError);

    function successLoadTickets(ticketsData) {
        console.log(ticketsData);
        ctx.tickets = ticketsData;
        auth.setAuth(ctx);
        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            filterBox: "./templates/tickets/viewTickets/filterBox.hbs",
            ticketBox: "./templates/tickets/viewTickets/ticketBox.hbs",
            page: "./templates/tickets/viewTickets/ticketsPage.hbs"
        }).then(function () {
            this.partial("./templates/common/main.hbs")
                .then(attachDeleteEvents);

            function attachDeleteEvents() {
                let deleteButtons = $('#viewHome').find('.btn-delete');
                if(sessionStorage.getItem('status') !== 'administrator') {
                    deleteButtons.hide();
                    return
                }

                deleteButtons.click(deleteTickets);

                function deleteTickets() {
                    let ticketId = $(this).attr('data-id');
                    ticketsService.deleteTicket(ticketId)
                        .then(successDeleteTicket)
                        .catch(message.handleError);

                    function successDeleteTicket() {
                        location.reload();
                    }
                }
            }
        });
    }
};