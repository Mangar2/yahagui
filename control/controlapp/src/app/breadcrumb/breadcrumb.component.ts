/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbList: any[] = []
    
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let topic = params.get('topicFilter')
            if (typeof(topic) !== 'string') {
                topic = ''
            }
            const topicChunks = topic.split('|')
            this.breadcrumbList = [ { name: 'Home', link: '/'} ]
            let curLink = ''
            let spacer = ''
            for (let name of topicChunks) {
                if (name !== '') {
                    curLink = curLink + spacer + name
                    this.breadcrumbList.push( { name, link: curLink })
                    spacer = '|'
                }
            }
        });
    }

}
